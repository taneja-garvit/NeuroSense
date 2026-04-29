const Recommendation = require('../models/Recommendation');

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

// @desc    Get recommendations by risk level
// @route   GET /api/recommendations/:riskLevel
// @access  Private
const getRecommendationsByRiskLevel = async (req, res) => {
    try {
        const { riskLevel } = req.params;

        // Validate risk level
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

module.exports = {
    getAllRecommendations,
    getRecommendationsByRiskLevel
};
