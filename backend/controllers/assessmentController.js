const Assessment = require('../models/Assessment');
const {
    calculateRiskScore,
    getRiskLevel,
    generateInsights,
    generateSentimentAnalysis
} = require('../utils/riskScoring');
const groqService = require('../services/groqService');

const MAX_QUESTIONS = groqService.MAX_QUESTIONS || 6;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function countAiQuestions(conversation) {
    return (conversation || []).filter((m) => m.role === 'ai').length;
}

// Lightweight fallback so the user is never stuck if Groq is unreachable.
const FALLBACK_QUESTIONS = [
    {
        text: 'How anxious do you typically feel in everyday social situations?',
        format: 'mcq',
        options: ['Not at all', 'A little', 'Moderately', 'Very anxious', 'Extremely anxious']
    },
    {
        text: 'How often do you find yourself avoiding social gatherings or interactions?',
        format: 'mcq',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always']
    },
    {
        text: 'Do you experience physical symptoms like sweating, trembling, or a racing heart in social settings?',
        format: 'mcq',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
        text: 'Could you describe a recent social situation that felt difficult, and what went through your mind?',
        format: 'text'
    },
    {
        text: 'How much do these feelings affect your work, studies, or personal relationships?',
        format: 'mcq',
        options: ['Not at all', 'A little', 'Moderately', 'A lot', 'Severely']
    }
];

function fallbackNextQuestion(questionCount) {
    if (questionCount >= FALLBACK_QUESTIONS.length) {
        return { done: true, reason: 'fallback question bank exhausted' };
    }
    const q = FALLBACK_QUESTIONS[questionCount];
    return {
        done: false,
        question: {
            id: `q${questionCount + 1}`,
            text: q.text,
            format: q.format,
            options: q.options || undefined,
            rationale: 'fallback'
        }
    };
}

// Heuristic fallback analysis when Groq is unreachable. Produces a safe,
// generic mid-range result so the user can still see a meaningful screen.
function fallbackAnalysis(conversation) {
    const userTurns = (conversation || []).filter((m) => m.role === 'user');
    const text = userTurns.map((m) => m.content).join(' ').toLowerCase();

    const negativeHits = (text.match(/\b(anxious|panic|afraid|scared|avoid|avoid(ed|ing)|worry|nervous|sweat|tremble|racing|negative|alone|hate|cant|cannot|never|always)\b/g) || []).length;
    const positiveHits = (text.match(/\b(fine|good|okay|calm|confident|comfortable|enjoy|happy)\b/g) || []).length;

    let riskScore = 40 + Math.min(40, negativeHits * 5) - Math.min(20, positiveHits * 4);
    riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));
    const riskLevel = riskScore >= 70 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low';

    const insights = [
        {
            type: 'pattern',
            title: 'Screening Snapshot',
            description: 'A short screening conversation suggests it may be worth reflecting on how social situations affect you.',
            impact: riskLevel
        },
        {
            type: 'cognitive',
            title: 'Self-Talk Patterns',
            description: 'Notice the thoughts that come up before social events; gentle reframing can help.',
            impact: 'Medium'
        },
        {
            type: 'behavioral',
            title: 'Gradual Exposure',
            description: 'Small, repeated exposure to mild social situations tends to reduce anxiety over time.',
            impact: 'Medium'
        }
    ];

    return {
        riskScore,
        riskLevel,
        sentimentAnalysis: {
            negative: 40,
            neutral: 35,
            positive: 25
        },
        insights,
        summary: 'Thanks for sharing. Based on what you described, here is a preliminary screening view. This is not a diagnosis — consider it a starting point for reflection.',
        crisisFlag: /\b(suicide|kill myself|end my life|hurt myself|self[- ]harm)\b/i.test(text)
    };
}

/* -------------------------------------------------------------------------- */
/* AI chat endpoints                                                          */
/* -------------------------------------------------------------------------- */

// @desc    Start a new AI chat assessment
// @route   POST /api/assessment/start
// @access  Private
const startChat = async (req, res) => {
    try {
        const assessment = await Assessment.create({
            user: req.user._id,
            conversation: [],
            status: 'in_progress'
        });

        let next;
        try {
            next = await groqService.getNextQuestion([], 0);
        } catch (err) {
            console.error('Groq getNextQuestion (start) failed, using fallback:', err.message);
            next = fallbackNextQuestion(0);
        }

        if (next.done) {
            // Extremely unlikely on first call, but cover it.
            next = fallbackNextQuestion(0);
        }

        const aiTurn = {
            role: 'ai',
            content: next.question.text,
            format: next.question.format,
            options: next.question.format === 'mcq' ? next.question.options : undefined,
            questionId: next.question.id,
            timestamp: new Date()
        };
        assessment.conversation.push(aiTurn);
        await assessment.save();

        res.status(201).json({
            success: true,
            data: {
                assessmentId: assessment._id,
                question: {
                    id: next.question.id,
                    text: next.question.text,
                    format: next.question.format,
                    options: aiTurn.options || []
                },
                progress: { asked: 1, max: MAX_QUESTIONS }
            }
        });
    } catch (error) {
        console.error('Start chat assessment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error starting assessment',
            error: error.message
        });
    }
};

// @desc    Submit an answer in the AI chat assessment
// @route   POST /api/assessment/answer
// @access  Private
const submitChatAnswer = async (req, res) => {
    try {
        const { assessmentId, answer } = req.body;
        if (!assessmentId || typeof answer !== 'string' || !answer.trim()) {
            return res.status(400).json({
                success: false,
                message: 'assessmentId and answer are required'
            });
        }

        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }
        if (assessment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (assessment.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Assessment already completed' });
        }

        assessment.conversation.push({
            role: 'user',
            content: answer.trim(),
            timestamp: new Date()
        });

        const questionsAsked = countAiQuestions(assessment.conversation);
        const reachedCap = questionsAsked >= MAX_QUESTIONS;

        let next;
        if (!reachedCap) {
            try {
                next = await groqService.getNextQuestion(assessment.conversation, questionsAsked);
            } catch (err) {
                console.error('Groq getNextQuestion failed, using fallback:', err.message);
                next = fallbackNextQuestion(questionsAsked);
            }
        } else {
            next = { done: true, reason: 'max questions reached' };
        }

        if (next.done || questionsAsked >= MAX_QUESTIONS) {
            let analysis;
            try {
                analysis = await groqService.analyzeTranscript(assessment.conversation);
            } catch (err) {
                console.error('Groq analyzeTranscript failed, using heuristic fallback:', err.message);
                analysis = fallbackAnalysis(assessment.conversation);
            }

            assessment.riskScore = analysis.riskScore;
            assessment.riskLevel = analysis.riskLevel;
            assessment.sentimentAnalysis = analysis.sentimentAnalysis;
            assessment.insights = analysis.insights;
            assessment.summary = analysis.summary;
            assessment.crisisFlag = !!analysis.crisisFlag;
            assessment.status = 'completed';
            await assessment.save();

            return res.status(200).json({
                success: true,
                data: {
                    done: true,
                    assessment
                }
            });
        }

        const aiTurn = {
            role: 'ai',
            content: next.question.text,
            format: next.question.format,
            options: next.question.format === 'mcq' ? next.question.options : undefined,
            questionId: next.question.id,
            timestamp: new Date()
        };
        assessment.conversation.push(aiTurn);
        await assessment.save();

        return res.status(200).json({
            success: true,
            data: {
                done: false,
                assessmentId: assessment._id,
                question: {
                    id: next.question.id,
                    text: next.question.text,
                    format: next.question.format,
                    options: aiTurn.options || []
                },
                progress: {
                    asked: countAiQuestions(assessment.conversation),
                    max: MAX_QUESTIONS
                }
            }
        });
    } catch (error) {
        console.error('Submit chat answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing answer',
            error: error.message
        });
    }
};

/* -------------------------------------------------------------------------- */
/* Legacy endpoints (kept for backwards compatibility)                        */
/* -------------------------------------------------------------------------- */

// @desc    Submit new assessment (LEGACY static-form flow)
// @route   POST /api/assessment/submit
// @access  Private
const submitAssessment = async (req, res) => {
    try {
        const { questionnaire, textInput } = req.body;

        if (!questionnaire) {
            return res.status(400).json({
                success: false,
                message: 'Please provide questionnaire responses'
            });
        }

        const { q1_socialSituations, q2_avoidance, q3_physicalSymptoms, q4_negativeThoughts } = questionnaire;

        if (!q1_socialSituations || !q2_avoidance || !q3_physicalSymptoms || !q4_negativeThoughts) {
            return res.status(400).json({
                success: false,
                message: 'Please answer all questionnaire questions'
            });
        }

        const riskScore = calculateRiskScore(questionnaire);
        const riskLevel = getRiskLevel(riskScore);
        const insights = generateInsights(questionnaire, textInput);
        const sentimentAnalysis = generateSentimentAnalysis(questionnaire, textInput);

        const assessment = await Assessment.create({
            user: req.user._id,
            questionnaire,
            textInput: textInput || '',
            riskScore,
            riskLevel,
            insights,
            sentimentAnalysis,
            status: 'completed'
        });

        res.status(201).json({
            success: true,
            data: assessment
        });
    } catch (error) {
        console.error('Submit assessment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting assessment',
            error: error.message
        });
    }
};

const getAssessmentHistory = async (req, res) => {
    try {
        const assessments = await Assessment.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json({
            success: true,
            count: assessments.length,
            data: assessments
        });
    } catch (error) {
        console.error('Get assessment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching assessment history',
            error: error.message
        });
    }
};

const getAssessmentById = async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id);

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found'
            });
        }

        if (assessment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this assessment'
            });
        }

        res.status(200).json({
            success: true,
            data: assessment
        });
    } catch (error) {
        console.error('Get assessment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching assessment',
            error: error.message
        });
    }
};

// @desc    Get static questionnaire questions (LEGACY)
// @route   GET /api/assessment/questions
// @access  Public
const getQuestions = async (req, res) => {
    try {
        const questions = [
            {
                id: 'q1_socialSituations',
                question: 'How anxious do you feel in social situations?',
                description: 'Rate your anxiety level when interacting with others',
                scale: {
                    min: 1,
                    max: 5,
                    labels: {
                        1: 'Not anxious at all',
                        2: 'Slightly anxious',
                        3: 'Moderately anxious',
                        4: 'Very anxious',
                        5: 'Extremely anxious'
                    }
                }
            },
            {
                id: 'q2_avoidance',
                question: 'How often do you avoid social gatherings?',
                description: 'Frequency of avoiding social events or interactions',
                scale: {
                    min: 1,
                    max: 5,
                    labels: {
                        1: 'Never',
                        2: 'Rarely',
                        3: 'Sometimes',
                        4: 'Often',
                        5: 'Always'
                    }
                }
            },
            {
                id: 'q3_physicalSymptoms',
                question: 'Do you experience physical symptoms (sweating, trembling, rapid heartbeat) in social settings?',
                description: 'Physical manifestations of anxiety in social situations',
                scale: {
                    min: 1,
                    max: 5,
                    labels: {
                        1: 'Never',
                        2: 'Rarely',
                        3: 'Sometimes',
                        4: 'Often',
                        5: 'Always'
                    }
                }
            },
            {
                id: 'q4_negativeThoughts',
                question: 'How often do you have negative thoughts about social interactions?',
                description: 'Frequency of worrying or negative self-talk before/during social events',
                scale: {
                    min: 1,
                    max: 5,
                    labels: {
                        1: 'Never',
                        2: 'Rarely',
                        3: 'Sometimes',
                        4: 'Often',
                        5: 'Always'
                    }
                }
            }
        ];

        res.status(200).json({
            success: true,
            data: questions
        });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching questions',
            error: error.message
        });
    }
};

module.exports = {
    startChat,
    submitChatAnswer,
    submitAssessment,
    getAssessmentHistory,
    getAssessmentById,
    getQuestions
};
