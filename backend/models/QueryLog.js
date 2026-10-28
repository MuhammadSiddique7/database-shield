const mongoose = require('mongoose');

const QueryLogSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true
  },
  databaseType: {
    type: String,
    default: 'Unknown'
  },
  ip: {
    type: String,
    default: 'unknown'
  },
  status: {
    type: String,
    required: true,
    enum: ['allow', 'block']
  },
  risk: {
    type: String,
    required: true,
    enum: ['none', 'low', 'medium', 'high', 'critical']
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  reason: {
    type: String,
    required: true
  },
  threats: [{
    type: {
      type: String
    },
        description: String,
    severity: String,
    ruleId: String
  }],
  // ML model ka attack-probability (0..1). Purane logs / model offline: null
  mlScore: {
    type: Number,
    default: null,
    min: 0,
    max: 1
  },
  // Faisla kisne kiya: rules | rules+ml | ml | ml_override
  decisionSource: {
    type: String,
    default: 'rules'
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index
QueryLogSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('QueryLog', QueryLogSchema);
