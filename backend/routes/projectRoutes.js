const express = require('express');
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  regenerateApiKey
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.post('/:id/regenerate-key', regenerateApiKey);

module.exports = router;
