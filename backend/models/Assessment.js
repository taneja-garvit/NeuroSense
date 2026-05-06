const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Legacy questionnaire responses (kept optional for backward compatibility
    // with the old static 4-question flow). The new AI flow uses `conversation`.
    questionnaire: {
        q1_socialSituations: { type: Number, min: 1, max: 5 },
        q2_avoidance: { type: Number, min: 1, max: 5 },
        q3_physicalSymptoms: { type: Number, min: 1, max: 5 },
        q4_negativeThoughts: { type: Number, min: 1, max: 5 }
    },
    // New AI chatbot transcript (turn-by-turn).
    conversation: [{
        role: {
            type: String,
            enum: ['ai', 'user'],
            required: true
        },
        content: { type: String, required: true },
        format: {
            type: String,
            enum: ['mcq', 'text']
        },
        options: [{ type: String }],
        questionId: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
    // Optional free-text input from the legacy form.
    textInput: {
        type: String,
        default: ''
    },
    // Computed risk score (0-100). Required only once analysis is complete.
    riskScore: {
        type: Number,
        min: 0,
        max: 100
    },
    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High']
    },
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
    sentimentAnalysis: {
        negative: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 },
        positive: { type: Number, default: 0 }
    },
    // AI-written empathetic narrative shown on the results screen.
    summary: {
        type: String,
        default: ''
    },
    // True when the conversation contains self-harm / acute crisis cues.
    crisisFlag: {
        type: Boolean,
        default: false
    },
    // Workflow status for the AI chat session.
    status: {
        type: String,
        enum: ['in_progress', 'completed'],
        default: 'in_progress'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Assessment', assessmentSchema);
