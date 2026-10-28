import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../common/EmptyState';
import MlScore, { getSourceLabel, formatMlPrediction } from '../common/MlScore';
import { HiOutlineDocumentText, HiOutlineFunnel } from 'react-icons/hi2';

const formatTimeAgo = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
};

const ActivityTable = ({ logs }) => {
  const [expandedLog, setExpandedLog] = useState(null);
  if (!logs || logs.length === 0) {
    return (
      <div className="glass-card">
        <EmptyState
          icon={HiOutlineDocumentText}
          title="No Recent Activity"
          description="We haven't detected any queries yet. Make sure your API is integrated correctly."
        />
      </div>
    );
  }

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
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="table-header">Query</th>
              <th className="table-header">Status</th>
              <th className="table-header">Risk</th>
              <th className="table-header">Confidence</th>
              <th className="table-header">ML Score</th>
              <th className="table-header">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {logs.map((log) => (
              <React.Fragment key={log._id || log.id || Math.random()}>
                <tr 
                  onClick={() => setExpandedLog(expandedLog === (log._id || log.id) ? null : (log._id || log.id))}
                  className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                >
                <td className="table-cell">
                  <div className="font-mono text-sm truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] text-gray-300" title={log.query}>
                    {log.query?.length > 50 ? `${log.query.substring(0, 50)}...` : log.query}
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
                <td className="table-cell text-gray-300">
                  {log.confidence !== undefined ? `${(log.confidence > 1 ? log.confidence : log.confidence * 100).toFixed(1)}%` : '-'}
                </td>
                <td className="table-cell">
                  <MlScore score={log.mlScore} />
                </td>
                <td className="table-cell text-gray-400 text-sm">
                  {formatTimeAgo(log.createdAt || log.timestamp)}
                </td>
                </tr>
                <AnimatePresence>
                  {expandedLog === (log._id || log.id) && (
                    <tr>
                      <td colSpan={6} className="bg-gray-900/50 p-0 border-b border-gray-800">
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
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Confidence Score</p>
                              <p className="text-white font-medium">{log.confidence !== undefined ? `${(log.confidence > 1 ? log.confidence : log.confidence * 100).toFixed(1)}%` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">ML Prediction</p>
                              <p className="text-white font-medium">{formatMlPrediction(log.mlScore)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Decision By</p>
                              <p className="text-white font-medium">{getSourceLabel(log.decisionSource)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Execution Time</p>
                              <p className="text-white font-medium">{log.analysisTimeMs || '< 1'}ms</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Source IP</p>
                              <p className="text-white font-medium">{log.ipAddress || log.ip || 'Unknown'}</p>
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
                                      {threat.ruleId && <span className="ml-2 font-mono text-xs text-gray-500">[{threat.ruleId}]</span>}
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
    </div>
  );
};

export default ActivityTable;