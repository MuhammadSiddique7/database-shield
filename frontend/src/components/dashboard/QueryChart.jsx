import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 text-sm">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const QueryChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="glass-card p-6 h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-6">Query Volume</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} tickMargin={10} />
            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} tickMargin={10} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="safe" name="Safe Queries" stroke="#34d399" fillOpacity={1} fill="url(#colorSafe)" />
            <Area type="monotone" dataKey="blocked" name="Blocked Queries" stroke="#f87171" fillOpacity={1} fill="url(#colorBlocked)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QueryChart;
