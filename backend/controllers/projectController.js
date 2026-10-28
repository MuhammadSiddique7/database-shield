const Project = require('../models/Project');
const QueryLog = require('../models/QueryLog');
const generateApiKey = require('../utils/generateApiKey');

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to access this project' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this project' });
    }

    const { name, description, databaseType, platform, mode } = req.body;

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, databaseType, platform, mode },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    await QueryLog.deleteMany({ project: req.params.id });

    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.regenerateApiKey = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this project' });
    }

    project.apiKey = generateApiKey();
    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};
