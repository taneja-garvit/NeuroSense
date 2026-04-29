const express = require('express');
const router = express.Router();
const {
    submitAssessment,
    getAssessmentHistory,
    getAssessmentById,
    getQuestions
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/questions', getQuestions);

// Protected routes
router.post('/submit', protect, submitAssessment);
router.get('/history', protect, getAssessmentHistory);
router.get('/:id', protect, getAssessmentById);

module.exports = router;
