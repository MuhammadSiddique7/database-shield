import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineDocumentText } from 'react-icons/hi2';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { getLogs, getProjects } from '../services/api';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  
  const [filters, setFilters] = useState({
    status: '',
    riskLevel: '',
    project: '',
    search: ''
  });

  const fetchLogs = async (currentFilters = filters, page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 20,
        ...currentFilters
      };
      const res = await getLogs(params);
      setLogs(res.data.data || []);
      setPagination(res.data.pagination || { page: 1, limit: 20, total: 0, pages: 1 });
    } catch (error) {
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const projRes = await getProjects();
        setProjects(projRes.data.data || projRes.data || []);
        await fetchLogs();
      } catch (error) {
        console.error('Initial data fetch error');
      }
    };
    fetchInitialData();
  }, []);

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchLogs(newFilters, 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs(filters, 1);
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'text-yellow-400';
      case 'medium': return 'text-orange-400';
      case 'high': return 'text-red-400';
      case 'critical': return 'text-purple-400';
      default: return 'text-emerald-400';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader 
        title="Query Logs" 
        description="Detailed history of all analyzed database queries."
      />

      <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            placeholder="Search queries, IPs..."
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </form>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <select name="status" value={filters.status} onChange={handleFilterChange} className="input-field py-2 w-full sm:w-auto flex-1">
            <option value="">All Status</option>
            <option value="allow">Allowed</option>
            <option value="block">Blocked</option>
          </select>
          <select name="riskLevel" value={filters.riskLevel} onChange={handleFilterChange} className="input-field py-2 w-full sm:w-auto flex-1">
            <option value="">All Risks</option>
            <option value="safe">Safe</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select name="project" value={filters.project} onChange={handleFilterChange} className="input-field py-2 w-full sm:w-auto flex-1">
            <option value="">All Projects</option>
            {projects.map(p => (
              <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={HiOutlineDocumentText}
            title="No logs found"
            description="We couldn't find any query logs matching your current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="table-header w-1/2">Query</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Risk</th>
                  <th className="table-header hidden md:table-cell">Project</th>
                  <th className="table-header hidden lg:table-cell">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {logs.map((log) => (
                  <React.Fragment key={log._id || log.id}>
                    <tr 
                      onClick={() => setExpandedLog(expandedLog === (log._id || log.id) ? null : (log._id || log.id))}
                      className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                    >
                      <td className="table-cell">
                        <div className="font-mono text-sm truncate max-w-[120px] sm:max-w-[200px] md:max-w-md text-gray-300">
                          {log.query}
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                          log.status === 'allow' 
                            ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' 
                            : 'bg-red-400/10 text-red-400 border-red-400/20'
                        }`}>
                          {log.status?.toUpperCase() || 'ALLOW'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`font-medium whitespace-nowrap ${getRiskColor(log.risk || log.riskLevel)}`}>
                          {(log.risk || log.riskLevel || 'Safe').charAt(0).toUpperCase() + (log.risk || log.riskLevel || 'safe').slice(1)}
                        </span>
                      </td>
                      <td className="table-cell hidden md:table-cell text-gray-400">
                        {log.projectName || 'Default'}
                      </td>
                      <td className="table-cell hidden lg:table-cell text-gray-400 text-sm">
                        {new Date(log.createdAt || log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedLog === (log._id || log.id) && (
                        <tr>
                          <td colSpan={5} className="bg-gray-900/50 p-0 border-b border-gray-800">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="p-6 space-y-4"
                            >
                              <div>
                                <h4 className="text-sm font-semibold text-gray-400 mb-2">Full Query</h4>
                                <div className="bg-dark rounded-lg p-4 border border-gray-800 overflow-x-auto">
                                  <code className="text-cyan-400 font-mono text-sm whitespace-pre-wrap">{log.query}</code>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Confidence Score</p>
                                  <p className="text-white font-medium">{log.confidence !== undefined ? `${(log.confidence > 1 ? log.confidence : log.confidence * 100).toFixed(1)}%` : 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Execution Time</p>
                                  <p className="text-white font-medium">{log.analysisTimeMs || '< 1'}ms</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Source IP</p>
                                  <p className="text-white font-medium">{log.ipAddress || 'Unknown'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Database Type</p>
                                  <p className="text-white font-medium">{log.databaseType || 'Unknown'}</p>
                                </div>
                              </div>

                              {log.threats && log.threats.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Detected Threats</h4>
                                  <div className="space-y-2">
                                    {log.threats.map((threat, i) => (
                                      <div key={i} className="flex items-start gap-2 text-sm">
                                        <HiOutlineFunnel className="w-5 h-5 text-red-400 shrink-0" />
                                        <span className="text-red-200">
                                          {typeof threat === 'object' ? (threat.description || threat.type) : threat}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-800 flex justify-between items-center bg-gray-900/30">
            <p className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium text-white">{pagination.total}</span> results
            </p>
            <div className="flex gap-2">
              <button 
                disabled={pagination.page === 1}
                onClick={() => fetchLogs(filters, pagination.page - 1)}
                className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Previous
              </button>
              <button 
                disabled={pagination.page === pagination.pages}
                onClick={() => fetchLogs(filters, pagination.page + 1)}
                className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Logs;
