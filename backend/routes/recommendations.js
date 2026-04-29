const express = require('express');
const router = express.Router();
const {
    getAllRecommendations,
    getRecommendationsByRiskLevel
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

// Protected routes
router.get('/', protect, getAllRecommendations);
router.get('/:riskLevel', protect, getRecommendationsByRiskLevel);

module.exports = router;
