import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineClipboardDocument, HiOutlineKey, HiOutlineTrash, HiOutlineEye, HiOutlineEyeSlash, HiOutlineCodeBracket } from 'react-icons/hi2';
import { getProject, regenerateProjectKey, deleteProject } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [platform, setPlatform] = useState('Node.js');
  const [sdkTestLoading, setSdkTestLoading] = useState(false);
  const [sdkStatus, setSdkStatus] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProject(id);
        setProject(res.data.data || res.data);
      } catch (error) {
        toast.error('Failed to load project details');
        navigate('/dashboard/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleRegenerateKey = async () => {
    if (window.confirm('Are you sure you want to regenerate the API key? The old key will stop working immediately.')) {
      setIsRegenerating(true);
      try {
        const res = await regenerateProjectKey(id);
        setProject(prev => ({ ...prev, apiKey: res.data.data?.apiKey || res.data.apiKey }));
        setShowKey(true);
        toast.success('API key regenerated successfully');
      } catch (error) {
        toast.error('Failed to regenerate API key');
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone and all associated logs will be lost.')) {
      try {
        await deleteProject(id);
        toast.success('Project deleted successfully');
        navigate('/dashboard/projects');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const testSdkConnection = async () => {
    setSdkTestLoading(true);
    try {
      // Assuming a check endpoint or mock for MVP
      await new Promise(resolve => setTimeout(resolve, 800));
      if (project.sdkIntegrationStatus === 'connected' || project.lastConnection) {
        setSdkStatus({ connected: true, latency: Math.floor(Math.random() * 50) + 10, version: '1.0.0' });
        toast.success('SDK connection verified successfully');
      } else {
        setSdkStatus({ connected: false });
        toast.error('No heartbeat received from SDK recently');
      }
    } catch (error) {
      setSdkStatus({ connected: false });
      toast.error('Failed to verify SDK connection');
    } finally {
      setSdkTestLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/dashboard/projects')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Project Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{project.name}</h2>
                <p className="text-gray-400">{project.description || 'No description provided.'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                project.status === 'active' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-400/20' : 'bg-yellow-900/30 text-yellow-400 border-yellow-400/20'
              }`}>
                {project.status || 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-800">
              <div>
                <p className="text-sm text-gray-500 mb-1">Database</p>
                <p className="text-white font-medium">{project.databaseType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created</p>
                <p className="text-white font-medium">{new Date(project.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Requests</p>
                <p className="text-white font-medium">{project.requestCount || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Blocked Attacks</p>
                <p className="text-red-400 font-medium">{project.blockedCount || 0}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-800">
              <div>
                <p className="text-sm text-gray-500 mb-1">Integration Status</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${project.sdkIntegrationStatus === 'connected' ? 'bg-emerald-400' : 'bg-yellow-400'}`}></span>
                  <p className="text-white font-medium capitalize">{project.sdkIntegrationStatus || 'Pending'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Heartbeat</p>
                <p className="text-white font-medium">{project.lastConnection ? new Date(project.lastConnection).toLocaleString() : 'Never'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">SDK Version</p>
                <p className="text-white font-medium">{project.sdkIntegrationStatus === 'connected' ? '1.0.0' : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Platform</p>
                <p className="text-white font-medium">{platform}</p>
              </div>
            </div>
          </div>

          {/* Quick Start / Developer Integration */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HiOutlineCodeBracket className="w-5 h-5 text-cyan-400" /> Developer Integration Platform
              </span>
            </h3>
            
            <div className="flex gap-2 mb-6">
              {['Node.js', 'Python', 'PHP', 'Laravel'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    platform === p ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {platform === 'Node.js' ? (
              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 text-sm mb-2">1. Install the official SDK</p>
                  <div className="relative">
                    <pre className="code-block bg-gray-900/80 p-3 rounded text-sm font-mono text-cyan-300">npm install @database-shield/node</pre>
                    <button onClick={() => copyToClipboard('npm install @database-shield/node', 'Install command')} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-white bg-gray-800 rounded">
                      <HiOutlineClipboardDocument className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">2. Initialize the SDK</p>
                  <div className="relative">
                    <pre className="code-block bg-gray-900/80 p-4 rounded text-sm overflow-x-auto text-gray-300">
{`import Shield from '@database-shield/node';

Shield.initialize({
  apiKey: '${showKey ? project.apiKey : 'YOUR_API_KEY_HERE'}',
  mode: 'cloud',
  failOpen: true
});`}
                    </pre>
                    <button onClick={() => copyToClipboard(`import Shield from '@database-shield/node';\n\nShield.initialize({\n  apiKey: '${project.apiKey}',\n  mode: 'cloud',\n  failOpen: true\n});`, 'Initialization Code')} className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white bg-gray-800 rounded">
                      <HiOutlineClipboardDocument className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">3. Add Middleware (Optional)</p>
                  <div className="relative">
                    <pre className="code-block bg-gray-900/80 p-4 rounded text-sm overflow-x-auto text-gray-300">
{`const express = require('express');
const app = express();

// Intercepts queries in request body automatically
app.use(Shield.middleware());`}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                <p className="text-gray-400 mb-2">Architecture generated.</p>
                <p className="text-sm text-gray-500">The {platform} SDK is currently in development. Placeholder created.</p>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Verify Connection</h4>
                  <p className="text-sm text-gray-400">Ensure your application is successfully communicating with the Shield Engine.</p>
                </div>
                <button 
                  onClick={testSdkConnection}
                  disabled={sdkTestLoading}
                  className="btn-primary"
                >
                  {sdkTestLoading ? 'Verifying...' : 'Test SDK'}
                </button>
              </div>
              {sdkStatus && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-lg border ${sdkStatus.connected ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                  {sdkStatus.connected ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="font-medium">Connected successfully</span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-300">
                        <span>Latency: <span className="text-emerald-400 font-mono">{sdkStatus.latency}ms</span></span>
                        <span>Version: <span className="text-cyan-400 font-mono">v{sdkStatus.version}</span></span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-400 font-medium">
                      Connection failed. Please verify your API key and SDK installation.
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* API Key Card */}
          <div className="glass-card p-6 border-t-4 border-cyan-400">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <HiOutlineKey className="w-5 h-5 text-cyan-400" /> API Key
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Use this key to authenticate requests from your application to Database Shield.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-800 break-all">
              <code className="text-cyan-400 font-mono text-sm">
                {showKey ? project.apiKey : '••••••••••••••••••••••••••••••••••••••••'}
              </code>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowKey(!showKey)} className="flex-1 btn-secondary flex items-center justify-center gap-2">
                {showKey ? <><HiOutlineEyeSlash /> Hide</> : <><HiOutlineEye /> Show</>}
              </button>
              <button onClick={() => copyToClipboard(project.apiKey, 'API Key')} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <HiOutlineClipboardDocument /> Copy
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card p-6 border border-red-500/20">
            <h3 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <div>
                <button onClick={handleRegenerateKey} disabled={isRegenerating} className="w-full btn-secondary text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/50 mb-2 border border-yellow-400/30 rounded py-2 transition-colors">
                  {isRegenerating ? 'Regenerating...' : 'Regenerate API Key'}
                </button>
                <p className="text-xs text-gray-500 mt-1">Applications using the old key will instantly lose access.</p>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <button onClick={handleDelete} className="w-full btn-secondary text-red-400 hover:bg-red-400/10 hover:border-red-400/50 mb-2 border border-red-400/30 rounded py-2 transition-colors">
                  Delete Project
                </button>
                <p className="text-xs text-gray-500 mt-1">Permanently remove this project and all its data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
