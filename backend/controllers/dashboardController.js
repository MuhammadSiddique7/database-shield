const Project = require('../models/Project');
const QueryLog = require('../models/QueryLog');
const mongoose = require('mongoose');

exports.getStats = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    let projectIds = projects.map(p => p._id);
    
    if (req.query.project) {
      projectIds = projectIds.filter(id => id.toString() === req.query.project);
    }

    const totalRequests = await QueryLog.countDocuments({ project: { $in: projectIds } });
    const safeRequests = await QueryLog.countDocuments({ project: { $in: projectIds }, status: 'allow' });
    const blockedRequests = await QueryLog.countDocuments({ project: { $in: projectIds }, status: 'block' });
    const highRiskRequests = await QueryLog.countDocuments({ project: { $in: projectIds }, risk: { $in: ['high', 'critical'] } });

    res.status(200).json({
      success: true,
      data: {
        totalRequests,
        safeRequests,
        blockedRequests,
        highRiskRequests,
        totalProjects: projects.length
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecentActivity = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    let projectIds = projects.map(p => p._id);
    
    if (req.query.project) {
      projectIds = projectIds.filter(id => id.toString() === req.query.project);
    }

    const logs = await QueryLog.find({ project: { $in: projectIds } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('project', 'name');

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

exports.getChartData = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 7;
    const maxDays = Math.min(days, 30);
    
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setUTCDate(startDate.getUTCDate() - maxDays + 1);

    const aggData = await QueryLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          ...(req.query.project ? { project: new mongoose.Types.ObjectId(req.query.project) } : {}),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          safe: { $sum: { $cond: [{ $eq: ["$status", "allow"] }, 1, 0] } },
          blocked: { $sum: { $cond: [{ $eq: ["$status", "block"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const result = [];
    for (let i = 0; i < maxDays; i++) {
      const d = new Date(startDate);
      d.setUTCDate(d.getUTCDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const found = aggData.find(item => item._id === dateStr);
      if (found) {
        result.push({ date: dateStr, safe: found.safe, blocked: found.blocked });
      } else {
        result.push({ date: dateStr, safe: 0, blocked: 0 });
      }
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
