const Groq = require('groq-sdk');

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const MAX_QUESTIONS = 6;
const MIN_QUESTIONS = 5;

let cachedClient = null;
function getClient() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not configured');
    }
    if (!cachedClient) {
        cachedClient = new Groq({ apiKey });
    }
    return cachedClient;
}

/**
 * Low-level JSON call helper. Uses Groq's JSON mode and retries once with a
 * stricter instruction if parsing or schema validation fails.
 */
async function callGroqJSON({ systemPrompt, userPrompt, validate, temperature = 0.7 }) {
    const client = getClient();

    const runOnce = async (extraInstruction) => {
        const completion = await client.chat.completions.create({
            model: MODEL,
            response_format: { type: 'json_object' },
            temperature,
            messages: [
                { role: 'system', content: systemPrompt + (extraInstruction || '') },
                { role: 'user', content: userPrompt }
            ]
        });
        const raw = completion.choices?.[0]?.message?.content || '{}';
        return JSON.parse(raw);
    };

    let data;
    try {
        data = await runOnce('');
        if (validate) {
            const ok = validate(data);
            if (!ok) throw new Error('Schema validation failed');
        }
        return data;
    } catch (firstErr) {
        try {
            data = await runOnce(
                '\n\nCRITICAL: Respond ONLY with a single valid JSON object that matches the schema described above. No markdown, no code fences, no commentary.'
            );
            if (validate) {
                const ok = validate(data);
                if (!ok) throw new Error('Schema validation failed on retry');
            }
            return data;
        } catch (secondErr) {
            const msg = `Groq JSON call failed: ${firstErr.message} | retry: ${secondErr.message}`;
            const wrapped = new Error(msg);
            wrapped.cause = secondErr;
            throw wrapped;
        }
    }
}

/* ---------------------------------------------------------------------------
 * 1) Next adaptive question
 * ------------------------------------------------------------------------ */

const NEXT_Q_SYSTEM_PROMPT = `You are NeuroSense, an empathetic, clinically-cautious AI screener for SOCIAL ANXIETY.
You are NOT a doctor and you do NOT diagnose. You conduct a short adaptive screening conversation.

Your job for THIS turn:
- Look at the conversation so far and decide the single best next question to ask.
- Cover (across the whole session) these domains: social situations & interactions, avoidance behaviors,
  physical symptoms (sweating, trembling, racing heart), negative/self-critical thoughts, impact on daily life,
  and triggers. Do not repeat domains you have already covered well.
- Ask ONE question at a time, in warm and natural language (1-2 short sentences max).
- Choose the answer format that best fits this question:
  * "mcq" with 3-5 short, mutually exclusive options when a graded scale or category fits best.
  * "text" when a personal example or description would be more informative.
- After ${MIN_QUESTIONS}-${MAX_QUESTIONS} substantive Q&A turns, set "done": true. Never exceed ${MAX_QUESTIONS} questions.
- If the user has clearly given enough information earlier, you may stop sooner.
- Safety: if the user expresses self-harm, suicidal thoughts, or acute crisis, do NOT ask another probing
  question. Instead set "done": true so the analyzer can surface a crisis response.

Respond with a JSON object using EXACTLY this schema:

When asking another question:
{
  "done": false,
  "question": {
    "id": "q<n>",
    "text": "<the question to ask>",
    "format": "mcq" | "text",
    "options": ["..."],          // required only when format == "mcq", 3-5 entries
    "rationale": "<one short sentence on why you asked this, for internal logs>"
  }
}

When the conversation should end:
{
  "done": true,
  "reason": "<short reason, e.g. 'covered all key domains' or 'crisis cue detected'>"
}
`;

function validateNextQuestion(data) {
    if (!data || typeof data !== 'object') return false;
    if (data.done === true) return true;
    if (data.done !== false) return false;
    const q = data.question;
    if (!q || typeof q.text !== 'string' || !q.text.trim()) return false;
    if (q.format !== 'mcq' && q.format !== 'text') return false;
    if (q.format === 'mcq') {
        if (!Array.isArray(q.options) || q.options.length < 2) return false;
        if (!q.options.every((o) => typeof o === 'string' && o.trim().length > 0)) return false;
    }
    return true;
}

function transcriptToText(conversation) {
    if (!Array.isArray(conversation) || conversation.length === 0) {
        return '(no messages yet — this is the first turn)';
    }
    return conversation
        .map((m) => {
            const who = m.role === 'ai' ? 'AI' : 'User';
            let line = `${who}: ${m.content}`;
            if (m.role === 'ai' && Array.isArray(m.options) && m.options.length) {
                line += ` [options: ${m.options.join(' | ')}]`;
            }
            return line;
        })
        .join('\n');
}

async function getNextQuestion(conversation, questionCount) {
    const userPrompt = `Conversation so far:
${transcriptToText(conversation)}

Number of AI questions asked so far: ${questionCount} (max ${MAX_QUESTIONS}).
Decide the single best next question, OR finish the conversation. Respond with the JSON schema.`;
    return callGroqJSON({
        systemPrompt: NEXT_Q_SYSTEM_PROMPT,
        userPrompt,
        validate: validateNextQuestion,
        temperature: 0.6
    });
}

/* ---------------------------------------------------------------------------
 * 2) Analyze transcript -> risk score, sentiment, insights, summary
 * ------------------------------------------------------------------------ */

const ANALYZE_SYSTEM_PROMPT = `You are NeuroSense's analysis engine. You receive a short screening conversation
between an AI screener and a user about possible SOCIAL ANXIETY symptoms. Produce a structured analysis.

Rules:
- You are NOT diagnosing. The output is a screening estimate intended to encourage reflection or professional follow-up.
- "riskScore" is an integer 0-100 where higher = stronger indicators of social anxiety.
- "riskLevel" must follow these thresholds: 0-39 -> "Low", 40-69 -> "Medium", 70-100 -> "High".
- "sentimentAnalysis" gives integer percentages for negative, neutral, positive that sum to exactly 100.
- "insights" must be 3-5 entries. Each entry has:
    type: one of "sentiment" | "pattern" | "behavioral" | "cognitive"
    title: short title
    description: 1-2 sentences, specific and grounded in what the user actually said
    impact: "Low" | "Medium" | "High"
- "summary" is a warm 2-3 sentence narrative the user will read on their result screen. Empathetic, not clinical.
- "crisisFlag" is true ONLY if the user mentioned self-harm, suicidal thoughts, or an acute crisis. Otherwise false.

Respond with JSON ONLY using EXACTLY this schema:
{
  "riskScore": <int 0-100>,
  "riskLevel": "Low" | "Medium" | "High",
  "sentimentAnalysis": { "negative": <int>, "neutral": <int>, "positive": <int> },
  "insights": [ { "type": "...", "title": "...", "description": "...", "impact": "..." } ],
  "summary": "<2-3 sentence narrative>",
  "crisisFlag": <bool>
}
`;

function validateAnalysis(data) {
    if (!data || typeof data !== 'object') return false;
    if (typeof data.riskScore !== 'number' || data.riskScore < 0 || data.riskScore > 100) return false;
    if (!['Low', 'Medium', 'High'].includes(data.riskLevel)) return false;
    const s = data.sentimentAnalysis;
    if (!s || typeof s.negative !== 'number' || typeof s.neutral !== 'number' || typeof s.positive !== 'number') return false;
    if (!Array.isArray(data.insights) || data.insights.length === 0) return false;
    for (const ins of data.insights) {
        if (!ins || typeof ins.title !== 'string' || typeof ins.description !== 'string') return false;
        if (!['sentiment', 'pattern', 'behavioral', 'cognitive'].includes(ins.type)) return false;
        if (!['Low', 'Medium', 'High'].includes(ins.impact)) return false;
    }
    if (typeof data.summary !== 'string' || data.summary.length < 10) return false;
    if (typeof data.crisisFlag !== 'boolean') return false;
    return true;
}

function normalizeAnalysis(data) {
    let { negative, neutral, positive } = data.sentimentAnalysis;
    negative = Math.max(0, Math.round(negative));
    neutral = Math.max(0, Math.round(neutral));
    positive = Math.max(0, Math.round(positive));
    let sum = negative + neutral + positive;
    if (sum === 0) {
        negative = 33;
        neutral = 34;
        positive = 33;
    } else if (sum !== 100) {
        negative = Math.round((negative / sum) * 100);
        neutral = Math.round((neutral / sum) * 100);
        positive = 100 - negative - neutral;
    }
    data.sentimentAnalysis = { negative, neutral, positive };

    const score = Math.round(data.riskScore);
    let level = data.riskLevel;
    if (score >= 70) level = 'High';
    else if (score >= 40) level = 'Medium';
    else level = 'Low';
    data.riskScore = score;
    data.riskLevel = level;
    return data;
}

async function analyzeTranscript(conversation) {
    const userPrompt = `Conversation transcript to analyze:
${transcriptToText(conversation)}

Return the analysis JSON.`;
    const data = await callGroqJSON({
        systemPrompt: ANALYZE_SYSTEM_PROMPT,
        userPrompt,
        validate: validateAnalysis,
        temperature: 0.4
    });
    return normalizeAnalysis(data);
}

/* ---------------------------------------------------------------------------
 * 3) Personalized recommendations from transcript + analysis
 * ------------------------------------------------------------------------ */

const RECS_SYSTEM_PROMPT = `You are NeuroSense's personalized wellness planner. Based on a screening conversation
and its analysis, produce evidence-informed self-help recommendations across four buckets:
- "yoga": gentle yoga asanas suited to anxiety
- "meditation": mindfulness / breathing practices
- "lifestyle": daily habits (sleep, diet, exercise, social pacing)
- "remedy": therapeutic techniques (CBT-style reframing, journaling, grounding) and, for High risk, a clear
  prompt to seek a licensed mental health professional.

Rules:
- Total of 8-12 recommendations across the four buckets, with at least one in each of yoga/meditation/lifestyle.
- "remedy" entries are required only when riskLevel is "Medium" or "High".
- If "crisisFlag" is true, the FIRST item must be a "remedy" titled clearly about reaching out for immediate support
  (e.g. "Talk to someone right now"), with steps that mention contacting a trusted person and a helpline, and
  benefits framed around safety and not being alone.
- Each recommendation MUST be specific to what the user said when possible.
- Use only these icon names: Wind, BookOpen, Users, Target, Heart, Moon, Apple, Activity, AlertCircle, Phone, Lightbulb.
- Use only these Tailwind color classes for "color": "bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600", "bg-orange-100 text-orange-600", "bg-red-100 text-red-600", "bg-yellow-100 text-yellow-600".

Each recommendation object MUST follow this exact schema:
{
  "title": "string",
  "description": "string (1-2 sentences)",
  "type": "yoga" | "meditation" | "lifestyle" | "remedy",
  "category": "string short label",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "duration": "string e.g. '5-10 min'",
  "riskLevels": ["Low" | "Medium" | "High", ...],
  "icon": "<one of the icon names>",
  "color": "<one of the color classes>",
  "steps": ["string", "string", "..."],   // 3-6 steps
  "benefits": ["string", "string", "..."] // 2-4 benefits
}

Respond with JSON ONLY using EXACTLY this schema:
{
  "recommendations": [ <recommendation objects> ]
}
`;

function validateRecommendations(data) {
    if (!data || !Array.isArray(data.recommendations)) return false;
    if (data.recommendations.length < 4) return false;
    const validTypes = ['yoga', 'meditation', 'lifestyle', 'remedy'];
    for (const r of data.recommendations) {
        if (!r || typeof r.title !== 'string' || typeof r.description !== 'string') return false;
        if (!validTypes.includes(r.type)) return false;
        if (!Array.isArray(r.riskLevels) || r.riskLevels.length === 0) return false;
        if (!Array.isArray(r.steps) || r.steps.length === 0) return false;
        if (!Array.isArray(r.benefits) || r.benefits.length === 0) return false;
        if (typeof r.icon !== 'string' || typeof r.color !== 'string') return false;
    }
    return true;
}

async function generateRecommendations(conversation, analysis) {
    const userPrompt = `Conversation transcript:
${transcriptToText(conversation)}

Analysis:
${JSON.stringify(
        {
            riskScore: analysis.riskScore,
            riskLevel: analysis.riskLevel,
            crisisFlag: !!analysis.crisisFlag,
            insights: analysis.insights
        },
        null,
        2
    )}

Generate the personalized recommendations JSON.`;
    const data = await callGroqJSON({
        systemPrompt: RECS_SYSTEM_PROMPT,
        userPrompt,
        validate: validateRecommendations,
        temperature: 0.8
    });

    const stamped = data.recommendations.map((r, idx) => ({
        ...r,
        _id: `ai-${Date.now()}-${idx}`
    }));
    return stamped;
}

module.exports = {
    getNextQuestion,
    analyzeTranscript,
    generateRecommendations,
    MAX_QUESTIONS,
    MIN_QUESTIONS
};
