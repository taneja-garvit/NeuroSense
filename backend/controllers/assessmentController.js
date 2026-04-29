const Assessment = require('../models/Assessment');
const {
    calculateRiskScore,
    getRiskLevel,
    generateInsights,
    generateSentimentAnalysis
} = require('../utils/riskScoring');

// @desc    Submit new assessment
// @route   POST /api/assessment/submit
// @access  Private
const submitAssessment = async (req, res) => {
    try {
        const { questionnaire, textInput } = req.body;

        // Validation
        if (!questionnaire) {
            return res.status(400).json({
                success: false,
                message: 'Please provide questionnaire responses'
            });
        }

        // Validate all questions are answered
        const { q1_socialSituations, q2_avoidance, q3_physicalSymptoms, q4_negativeThoughts } = questionnaire;

        if (!q1_socialSituations || !q2_avoidance || !q3_physicalSymptoms || !q4_negativeThoughts) {
            return res.status(400).json({
                success: false,
                message: 'Please answer all questionnaire questions'
            });
        }

        // Calculate risk score
        const riskScore = calculateRiskScore(questionnaire);
        const riskLevel = getRiskLevel(riskScore);

        // Generate AI insights
        const insights = generateInsights(questionnaire, textInput);
        const sentimentAnalysis = generateSentimentAnalysis(questionnaire, textInput);

        // Create assessment
        const assessment = await Assessment.create({
            user: req.user._id,
            questionnaire,
            textInput: textInput || '',
            riskScore,
            riskLevel,
            insights,
            sentimentAnalysis
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

// @desc    Get user's assessment history
// @route   GET /api/assessment/history
// @access  Private
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

// @desc    Get specific assessment by ID
// @route   GET /api/assessment/:id
// @access  Private
const getAssessmentById = async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id);

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found'
            });
        }

        // Make sure user owns this assessment
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

// @desc    Get questionnaire questions
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
    submitAssessment,
    getAssessmentHistory,
    getAssessmentById,
    getQuestions
};
