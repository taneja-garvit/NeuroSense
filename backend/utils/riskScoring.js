/**
 * Calculate risk score based on questionnaire responses
 * Questions are rated 1-5, where higher = more anxiety
 * Total possible score: 4 questions × 5 points = 20 points
 * Convert to 0-100 scale
 */
const calculateRiskScore = (questionnaire) => {
    const { q1_socialSituations, q2_avoidance, q3_physicalSymptoms, q4_negativeThoughts } = questionnaire;

    // Sum all responses
    const totalScore = q1_socialSituations + q2_avoidance + q3_physicalSymptoms + q4_negativeThoughts;

    // Convert to 0-100 scale (max score is 20)
    const riskScore = (totalScore / 20) * 100;

    return Math.round(riskScore);
};

/**
 * Classify risk level based on score
 */
const getRiskLevel = (score) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
};

/**
 * Generate mock AI insights based on questionnaire responses
 */
const generateInsights = (questionnaire, textInput) => {
    const insights = [];

    // Insight based on social situations score
    if (questionnaire.q1_socialSituations >= 4) {
        insights.push({
            type: 'behavioral',
            title: 'Social Interaction Patterns',
            description: 'High anxiety levels detected in social situations. Consider gradual exposure therapy.',
            impact: 'High'
        });
    } else if (questionnaire.q1_socialSituations >= 3) {
        insights.push({
            type: 'behavioral',
            title: 'Social Interaction Patterns',
            description: 'Moderate discomfort in social settings. Practice may help build confidence.',
            impact: 'Medium'
        });
    }

    // Insight based on avoidance behavior
    if (questionnaire.q2_avoidance >= 4) {
        insights.push({
            type: 'pattern',
            title: 'Avoidance Behavior',
            description: 'Frequent avoidance of social gatherings detected. This may reinforce anxiety patterns.',
            impact: 'High'
        });
    }

    // Insight based on physical symptoms
    if (questionnaire.q3_physicalSymptoms >= 4) {
        insights.push({
            type: 'behavioral',
            title: 'Physical Symptoms',
            description: 'Significant physical manifestations of anxiety. Breathing exercises may provide relief.',
            impact: 'High'
        });
    } else if (questionnaire.q3_physicalSymptoms >= 3) {
        insights.push({
            type: 'behavioral',
            title: 'Physical Symptoms',
            description: 'Moderate physical symptoms present. Relaxation techniques recommended.',
            impact: 'Medium'
        });
    }

    // Insight based on negative thoughts
    if (questionnaire.q4_negativeThoughts >= 4) {
        insights.push({
            type: 'cognitive',
            title: 'Cognitive Patterns',
            description: 'Frequent negative self-talk detected. Cognitive restructuring may be beneficial.',
            impact: 'High'
        });
    }

    // Text sentiment insight (mock)
    if (textInput && textInput.length > 0) {
        insights.push({
            type: 'sentiment',
            title: 'Text Sentiment Analysis',
            description: 'Language patterns suggest heightened concern about social interactions.',
            impact: 'Medium'
        });
    }

    return insights;
};

/**
 * Generate mock sentiment analysis
 */
const generateSentimentAnalysis = (questionnaire, textInput) => {
    const avgScore = (
        questionnaire.q1_socialSituations +
        questionnaire.q2_avoidance +
        questionnaire.q3_physicalSymptoms +
        questionnaire.q4_negativeThoughts
    ) / 4;

    // Higher anxiety = more negative sentiment
    let negative, neutral, positive;

    if (avgScore >= 4) {
        negative = 60 + Math.floor(Math.random() * 15);
        neutral = 20 + Math.floor(Math.random() * 10);
        positive = 100 - negative - neutral;
    } else if (avgScore >= 3) {
        negative = 40 + Math.floor(Math.random() * 15);
        neutral = 30 + Math.floor(Math.random() * 10);
        positive = 100 - negative - neutral;
    } else {
        negative = 20 + Math.floor(Math.random() * 10);
        neutral = 30 + Math.floor(Math.random() * 10);
        positive = 100 - negative - neutral;
    }

    return { negative, neutral, positive };
};

module.exports = {
    calculateRiskScore,
    getRiskLevel,
    generateInsights,
    generateSentimentAnalysis
};
