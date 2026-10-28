const Project = require('../models/Project');
const QueryLog = require('../models/QueryLog');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const axios = require('axios');

exports.analyzeQuery = async (req, res, next) => {
  try {
    const { query, databaseType, ip, projectApiKey } = req.body;

    if (!query || !projectApiKey) {
      return res.status(400).json({ success: false, error: 'Query and projectApiKey are required' });
    }

    const project = await Project.findOne({ apiKey: projectApiKey });
    if (!project) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }

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
      ip: ip || req.ip,
      status,
      risk: data.risk_level || (data.is_safe ? 'none' : 'high'),
      confidence: data.confidence || 100,
      reason: data.reason || 'Analyzed by engine',
            threats,
      mlScore,
      decisionSource,
      project: project._id,
      user: project.user
    });

    project.totalRequests += 1;
    if (status === 'block') {
      project.blockedRequests += 1;

      // Send email alert asynchronously
      User.findById(project.user).then(user => {
        if (user && user.email) {
          sendEmail({
            to: user.email,
            subject: `🚨 Security Alert: Malicious Query Blocked in ${project.name}`,
            html: `
              <h2>Database Shield Security Alert</h2>
              <p>We have detected and successfully blocked a malicious query targeting your project: <strong>${project.name}</strong>.</p>
              
              <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Risk Level:</strong> ${queryLog.risk}</p>
                <p><strong>Source IP:</strong> ${queryLog.ip}</p>
                <p><strong>Detected Threats:</strong> ${queryLog.threats.map(t => t.type || t).join(', ')}</p>
                <p><strong>Query:</strong></p>
                <pre style="background: #333; color: #fff; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>${query}</code></pre>
              </div>
              
              <p>Please log in to your Database Shield dashboard to view full details and analysis.</p>
            `
          }).catch(err => console.error('Failed to send security alert email:', err));
        }
      }).catch(err => console.error('Error fetching user for alert:', err));
    }
    await project.save();

    res.status(200).json({
      success: true,
      data: {
        status,
        risk: queryLog.risk,
        confidence: queryLog.confidence,
        reason: queryLog.reason,
        mlScore: queryLog.mlScore,
        decisionSource: queryLog.decisionSource,
        threats: queryLog.threats 
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getQueryLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, risk, project, search } = req.query;
    
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (risk) filter.risk = risk;
    if (project) filter.project = project;
    if (search) filter.query = { $regex: search, $options: 'i' };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10);

    const logs = await QueryLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('project', 'name');

    const total = await QueryLog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page, 10),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getQueryLog = async (req, res, next) => {
  try {
    const log = await QueryLog.findById(req.params.id).populate('project', 'name');

    if (!log) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }

    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};
