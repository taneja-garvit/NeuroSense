const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Questionnaire responses (3-4 questions about anxiety)
    questionnaire: {
        q1_socialSituations: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            // Question: "How anxious do you feel in social situations?" (1-5 scale)
        },
        q2_avoidance: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            // Question: "How often do you avoid social gatherings?" (1-5 scale)
        },
        q3_physicalSymptoms: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            // Question: "Do you experience physical symptoms (sweating, trembling) in social settings?" (1-5 scale)
        },
        q4_negativeThoughts: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            // Question: "How often do you have negative thoughts about social interactions?" (1-5 scale)
        }
    },
    // Optional text input
    textInput: {
        type: String,
        default: ''
    },
    // Calculated risk score (0-100)
    riskScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    // Risk level classification
    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    },
    // Mock AI insights for demo
    insights: [{
        type: {
            type: String,
            enum: ['sentiment', 'pattern', 'behavioral', 'cognitive']
        },
        title: String,
        description: String,
        impact: {
            type: String,
            enum: ['Low', 'Medium', 'High']
        }
    }],
    // Mock sentiment analysis
    sentimentAnalysis: {
        negative: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 },
        positive: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Assessment', assessmentSchema);
