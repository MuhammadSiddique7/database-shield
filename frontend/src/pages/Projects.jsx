import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiOutlineFolderPlus, HiOutlineServer, HiOutlineClipboardDocument, HiOutlineTrash, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import PageHeader from '../components/common/PageHeader';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getProjects, createProject, deleteProject } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [formData, setFormData] = useState({ name: '', description: '', databaseType: 'PostgreSQL' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.data || res.data || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Project name is required');
    
    setIsSubmitting(true);
    try {
      await createProject(formData);
      toast.success('Project created successfully');
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', databaseType: 'PostgreSQL' });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(id);
        toast.success('Project deleted');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader 
        title="Projects" 
        description="Manage your database connections and API keys."
        action={
          <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary flex items-center gap-2">
            <HiOutlineFolderPlus className="w-5 h-5" /> New Project
          </button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={HiOutlineServer}
          title="No Projects Found"
          description="Create your first project to generate an API key and start analyzing database queries."
          actionLabel="Create Project"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div key={project._id || project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-hover p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <Link to={`/dashboard/projects/${project._id || project.id}`} className="hover:text-cyan-400 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-1 truncate">{project.name}</h3>
                </Link>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(project._id || project.id)} className="text-gray-500 hover:text-red-400 p-1 transition-colors" title="Delete">
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs font-medium border border-gray-700">
                  {project.databaseType}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 border ${
                  project.status === 'active' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-400/20' : 'bg-yellow-900/30 text-yellow-400 border-yellow-400/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'active' ? 'bg-emerald-400' : 'bg-yellow-400'}`}></span>
                  {project.status || 'Active'}
                </span>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-3 mb-4 mt-auto border border-gray-800">
                <p className="text-xs text-gray-500 mb-1">API Key</p>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-sm text-cyan-400 font-mono truncate">
                    {visibleKeys[project._id || project.id] ? project.apiKey : '••••••••••••••••••••••••••••'}
                  </code>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleKeyVisibility(project._id || project.id)} className="text-gray-500 hover:text-white p-1">
                      {visibleKeys[project._id || project.id] ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => copyToClipboard(project.apiKey)} className="text-gray-500 hover:text-white p-1">
                      <HiOutlineClipboardDocument className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                Requests: <span className="text-white font-medium">{project.totalRequests || 0}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Create New Project</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Production DB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of this project"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Database Type</label>
                  <select
                    className="input-field"
                    value={formData.databaseType}
                    onChange={(e) => setFormData({...formData, databaseType: e.target.value})}
                  >
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MySQL">MySQL</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="SQL Server">SQL Server</option>
                    <option value="Oracle">Oracle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-ghost">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;
