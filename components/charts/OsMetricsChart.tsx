
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimeSeriesData } from '../../types';

interface SingleMetricChartProps {
  data: TimeSeriesData[];
  strokeColor: string;
  fillColor: string;
  title: string;
  unit?: string;
}

export const SingleMetricChart: React.FC<SingleMetricChartProps> = ({ data, strokeColor, fillColor, title, unit = '%' }) => {
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
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id={`color_${fillColor.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.7}/>
              <stop offset="95%" stopColor={fillColor} stopOpacity={0}/>
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
          <YAxis stroke="#9CA3AF" domain={[0, 100]} unit={unit} tick={{ fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
            labelStyle={{ color: '#E5E7EB', marginBottom: '4px', fontWeight: 'bold' }}
            labelFormatter={tooltipLabelFormatter}
            formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, title]}
            itemStyle={{ color: strokeColor }}
          />
          <Area type="monotone" dataKey="value" stroke={strokeColor} fill={`url(#color_${fillColor.replace('#','')})`} strokeWidth={2} dot={false} name={title} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
