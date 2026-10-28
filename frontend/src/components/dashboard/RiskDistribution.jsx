import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RiskDistribution = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { name: 'Safe', value: stats.safe || 0, color: '#34d399' },
    { name: 'Low', value: stats.low || 0, color: '#facc15' },
    { name: 'Medium', value: stats.medium || 0, color: '#fb923c' },
    { name: 'High', value: stats.high || 0, color: '#f87171' },
    { name: 'Critical', value: stats.critical || 0, color: '#c084fc' }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3">
          <p className="text-white text-sm">
            <span style={{ color: payload[0].payload.color }} className="font-semibold">
              {payload[0].name}:
            </span>{' '}
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-2">Risk Distribution</h3>
      <div className="flex-1 relative min-h-0">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.1)" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskDistribution;
