import React from 'react';

const SOURCE_LABELS = {
  'rules': 'Rules only',
  'rules+ml': 'Rules + ML',
  'ml': 'ML detected (no rule matched)',
  'ml_override': 'ML cleared a rule match',
};

export const getSourceLabel = (source) => SOURCE_LABELS[source] || 'Rules only';

export const formatMlPrediction = (score) => {
  if (score === null || score === undefined) return 'N/A';
  return `${(score * 100).toFixed(1)}% (${score >= 0.5 ? 'attack likely' : 'looks normal'})`;
};

const MlScore = ({ score }) => {
  if (score === null || score === undefined) {
    return (
      <span className="text-gray-500 text-sm" title="No ML score (older log, or ML model was offline)">
        -
      </span>
    );
  }

  const pct = Math.min(Math.max(score * 100, 0), 100);
  const barColor = score >= 0.7 ? 'bg-red-500' : score >= 0.3 ? 'bg-yellow-400' : 'bg-emerald-400';
  const textColor = score >= 0.7 ? 'text-red-400' : score >= 0.3 ? 'text-yellow-400' : 'text-emerald-400';

  return (
    <div className="flex items-center gap-2 min-w-[96px]" title={`ML attack probability: ${pct.toFixed(1)}%`}>
      <div className="w-12 h-1.5 rounded-full bg-gray-800 overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-sm font-medium whitespace-nowrap ${textColor}`}>{pct.toFixed(1)}%</span>
    </div>
  );
};

export default MlScore;