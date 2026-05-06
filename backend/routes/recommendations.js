const express = require('express');
const router = express.Router();
const {
    getAllRecommendations,
    getRecommendationsByRiskLevel,
    getAIRecommendations
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

// AI personalized recommendations (must be before the :riskLevel route)
router.get('/ai/:assessmentId', protect, getAIRecommendations);

// Legacy / fallback
router.get('/', protect, getAllRecommendations);
router.get('/:riskLevel', protect, getRecommendationsByRiskLevel);

module.exports = router;
