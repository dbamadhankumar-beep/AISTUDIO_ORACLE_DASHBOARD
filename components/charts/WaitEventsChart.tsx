
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WaitEvent } from '../../types';

interface WaitEventsChartProps {
  data: WaitEvent[];
}

export const WaitEventsChart: React.FC<WaitEventsChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis dataKey="event" type="category" stroke="#9CA3AF" width={150} tick={{ fontSize: 12 }} />
          <Tooltip
             contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
             labelStyle={{ color: '#E5E7EB' }}
          />
          <Legend />
          <Bar dataKey="totalWaitTime" name="Total Wait Time (ms)" fill="url(#colorUv)" />
        </BarChart>
      </ResponsiveContainer>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
