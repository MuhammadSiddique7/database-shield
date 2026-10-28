const mongoose = require('mongoose');
const crypto = require('crypto');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description can not be more than 500 characters'],
    default: ''
  },
  databaseType: {
    type: String,
    required: [true, 'Please add a database type'],
    enum: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'MSSQL', 'Oracle', 'Other']
  },
  apiKey: {
    type: String,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  totalRequests: {
    type: Number,
    default: 0
  },
  blockedRequests: {
    type: Number,
    default: 0
  },
  sdkIntegrationStatus: {
    type: String,
    enum: ['pending', 'connected', 'error'],
    default: 'pending'
  },
  lastConnection: {
    type: Date
  },
  platform: {
    type: String,
    enum: ['Node.js', 'Python', 'PHP', 'Laravel', 'Other'],
    default: 'Other'
  },
  mode: {
    type: String,
    enum: ['cloud', 'private'],
    default: 'cloud'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to generate API key if not set
ProjectSchema.pre('save', function(next) {
  if (!this.apiKey) {
    this.apiKey = 'ds_live_' + crypto.randomBytes(32).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
