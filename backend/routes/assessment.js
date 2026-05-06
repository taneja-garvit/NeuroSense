const express = require('express');
const router = express.Router();
const {
    startChat,
    submitChatAnswer,
    submitAssessment,
    getAssessmentHistory,
    getAssessmentById,
    getQuestions
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');

// AI chat assessment (new flow)
router.post('/start', protect, startChat);
router.post('/answer', protect, submitChatAnswer);

// Legacy static questionnaire (kept for backwards compatibility)
router.get('/questions', getQuestions);
router.post('/submit', protect, submitAssessment);

// History + retrieval
router.get('/history', protect, getAssessmentHistory);
router.get('/:id', protect, getAssessmentById);

module.exports = router;
