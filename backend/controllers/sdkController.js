const Project = require('../models/Project');
const QueryLog = require('../models/QueryLog');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const axios = require('axios');

const extractApiKey = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  return req.body.apiKey;
};

exports.analyze = async (req, res, next) => {
  try {
    const { query, databaseType, timestamp, sdkVersion, endpoint, httpMethod, userId, sessionId, executionTimeMs, appVersion } = req.body;
    const apiKey = extractApiKey(req);

    if (!query || !apiKey) {
      return res.status(400).json({ success: false, error: 'Query and apiKey are required' });
    }

    const project = await Project.findOne({ apiKey });
    if (!project) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }

    // Connect to Python Engine
    let pythonResponse;
    try {
      pythonResponse = await axios.post(`${process.env.PYTHON_ENGINE_URL}/detect`, {
        query,
        database_type: databaseType
      });
    } catch (error) {
      return res.status(503).json({ success: false, error: 'Detection engine unavailable' });
    }

    const data = pythonResponse.data;
    const status = data.is_safe ? 'allow' : 'block';
    
    // Fallbacks
    const risk = data.risk_level || (data.is_safe ? 'none' : 'high');
    const reason = data.reason || 'Analyzed by Database Shield';
        const threats = (data.threats || []).map(t => ({
      type: t.type,
      description: t.description,
      severity: t.severity,
      ruleId: t.rule_id
    }));
    const mlScore = typeof data.ml_score === 'number' ? data.ml_score : null;
    const decisionSource = data.decision_source || 'rules';

    const queryLog = await QueryLog.create({
      query,
      databaseType: databaseType || project.databaseType,
      ip: req.ip, // From request
      status,
      risk,
      confidence: data.confidence || 100,
      reason,
      threats,
      mlScore,
      decisionSource,
      project: project._id,     
      user: project.user
    });

    project.totalRequests += 1;
    project.lastConnection = new Date();
    
    if (status === 'block') {
      project.blockedRequests += 1;

      // Send email asynchronously
      User.findById(project.user).then(user => {
        if (user && user.email) {
          sendEmail({
            to: user.email,
            subject: `🚨 Security Alert: Malicious Query Blocked in ${project.name}`,
            html: `
              <h2>Database Shield SDK Alert</h2>
              <p>We intercepted and blocked a malicious query from your application.</p>
              
              <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Risk Level:</strong> ${risk}</p>
                <p><strong>Source IP:</strong> ${req.ip}</p>
                <p><strong>Detected Threats:</strong> ${threats.map(t => t.type || t).join(', ')}</p>
                <p><strong>Query:</strong></p>
                <pre style="background: #333; color: #fff; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>${query}</code></pre>
              </div>
            `
          }).catch(err => console.error('Failed to send SDK email alert:', err));
        }
      }).catch(err => {});
    }

    await project.save();

    res.status(200).json({
      success: true,
      data: {
        status,
        risk,
        confidence: data.confidence || 100,
        reason,
        ruleId: data.ruleId || 'DBS-GENERAL-01',
        mlScore,
        decisionSource,
        threats
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.heartbeat = async (req, res, next) => {
  try {
    const apiKey = extractApiKey(req);
    if (!apiKey) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const project = await Project.findOne({ apiKey });
    if (project) {
      project.lastConnection = new Date();
      project.sdkIntegrationStatus = 'connected';
      await project.save();
    }
    
    res.status(200).json({ success: true, message: 'Heartbeat received' });
  } catch (error) {
    next(error);
  }
};

exports.version = (req, res, next) => {
  res.status(200).json({ success: true, data: { backendVersion: '1.0.0', requiredSdkVersion: '1.0.0' } });
};

exports.log = async (req, res, next) => {
  // Telemetry endpoint
  try {
    const apiKey = extractApiKey(req);
    // Could save telemetry to database
    res.status(200).json({ success: true, message: 'Telemetry logged' });
  } catch (error) {
    next(error);
  }
};

exports.config = async (req, res, next) => {
  try {
    const apiKey = extractApiKey(req);
    if (!apiKey) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const project = await Project.findOne({ apiKey });
    if (!project) return res.status(401).json({ success: false, error: 'Invalid API key' });

    res.status(200).json({
      success: true,
      data: {
        mode: project.mode || 'cloud',
        failOpen: true,
        timeoutMs: 3000
      }
    });
  } catch (error) {
    next(error);
  }
};
