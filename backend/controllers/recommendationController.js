const Recommendation = require('../models/Recommendation');
const Assessment = require('../models/Assessment');
const groqService = require('../services/groqService');

// @desc    Get all recommendations
// @route   GET /api/recommendations
// @access  Private
const getAllRecommendations = async (req, res) => {
    try {
        const recommendations = await Recommendation.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: recommendations.length,
            data: recommendations
        });
    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recommendations',
            error: error.message
        });
    }
};

// @desc    Get recommendations by risk level (legacy / fallback)
// @route   GET /api/recommendations/:riskLevel
// @access  Private
const getRecommendationsByRiskLevel = async (req, res) => {
    try {
        const { riskLevel } = req.params;

        if (!['Low', 'Medium', 'High'].includes(riskLevel)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid risk level. Must be Low, Medium, or High'
            });
        }

        const recommendations = await Recommendation.find({
            riskLevels: riskLevel
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: recommendations.length,
            riskLevel,
            data: recommendations
        });
    } catch (error) {
        console.error('Get recommendations by risk level error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recommendations',
            error: error.message
        });
    }
};

// @desc    Get AI-generated personalized recommendations for a specific assessment
// @route   GET /api/recommendations/ai/:assessmentId
// @access  Private
const getAIRecommendations = async (req, res) => {
    try {
        const { assessmentId } = req.params;

        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }
        if (assessment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (assessment.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Assessment is not completed yet'
            });
        }

        const analysis = {
            riskScore: assessment.riskScore,
            riskLevel: assessment.riskLevel,
            crisisFlag: !!assessment.crisisFlag,
            insights: assessment.insights || []
        };

        try {
            const recs = await groqService.generateRecommendations(
                assessment.conversation || [],
                analysis
            );
            return res.status(200).json({
                success: true,
                source: 'ai',
                count: recs.length,
                riskLevel: assessment.riskLevel,
                data: recs
            });
        } catch (err) {
            console.error('Groq generateRecommendations failed, falling back to seeded DB:', err.message);
            const fallback = await Recommendation.find({
                riskLevels: assessment.riskLevel
            }).sort({ createdAt: -1 });
            return res.status(200).json({
                success: true,
                source: 'fallback',
                count: fallback.length,
                riskLevel: assessment.riskLevel,
                data: fallback,
                warning: 'AI recommendations unavailable, showing curated set instead.'
            });
        }
    } catch (error) {
        console.error('Get AI recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching AI recommendations',
            error: error.message
        });
    }
};

module.exports = {
    getAllRecommendations,
    getRecommendationsByRiskLevel,
    getAIRecommendations
};
