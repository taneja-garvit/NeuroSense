const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['yoga', 'meditation', 'lifestyle', 'remedy'],
        required: true
    },
    category: {
        type: String,
        enum: ['breathing', 'cognitive', 'behavioral', 'mindfulness', 'social', 'physical', 'nutrition', 'sleep', 'professional'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    duration: {
        type: String,
        required: true
    },
    // Which risk levels this recommendation applies to
    riskLevels: [{
        type: String,
        enum: ['Low', 'Medium', 'High']
    }],
    // For frontend display
    icon: {
        type: String,
        default: 'Heart'
    },
    color: {
        type: String,
        default: 'bg-blue-100 text-blue-600'
    },
    // Detailed steps (optional)
    steps: [{
        type: String
    }],
    benefits: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
