import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimeSeriesData } from '../../types';

interface ActiveSessionCountChartProps {
  data: TimeSeriesData[];
}

export const ActiveSessionCountChart: React.FC<ActiveSessionCountChartProps> = ({ data }) => {
  const chartData = data.map(point => ({
    timestamp: new Date(point.timestamp).getTime(),
    value: point.value,
  }));
  
  const tickFormatter = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  
  const tooltipLabelFormatter = (label: number) => new Date(label).toLocaleString();

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorActiveSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.7}/>
              <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" vertical={false} />
          <XAxis 
            dataKey="timestamp"
            type="number"
            domain={['dataMin', 'dataMax']}
            stroke="#9CA3AF"
            tick={{ fontSize: 10 }}
            tickFormatter={tickFormatter}
            minTickGap={40}
          />
          <YAxis stroke="#9CA3AF" domain={[0, 'dataMax + 10']} allowDecimals={false} tick={{ fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
            labelStyle={{ color: '#E5E7EB', marginBottom: '4px', fontWeight: 'bold' }}
            labelFormatter={tooltipLabelFormatter}
            formatter={(value: number) => [`${value.toFixed(0)} sessions`, 'Active Sessions']}
            itemStyle={{ color: '#4ADE80' }}
          />
          <Area type="monotone" dataKey="value" stroke="#4ADE80" fill="url(#colorActiveSessions)" strokeWidth={2} dot={false} name="Active Sessions" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};