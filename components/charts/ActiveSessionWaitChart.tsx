import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WaitEventHistoryPoint } from '../../types';

interface ActiveSessionWaitChartProps {
  data: WaitEventHistoryPoint[];
}

const colors = ['#38bdf8', '#a78bfa', '#f472b6', '#4ade80', '#fbbf24', '#f87171'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const timestamp = new Date(label).toLocaleString();
        const { originalEvents } = payload[0].payload;

        const allEventNames = Array.from(new Set(payload.map(p => p.dataKey)));
        // Fix: Explicitly type 'name' as a string to prevent it from being inferred as 'unknown'
        // when iterating over `allEventNames`, which is derived from an `any` typed payload.
        const colorMap = allEventNames.reduce((acc, name: string, index) => {
            acc[name] = colors[index % colors.length];
            return acc;
        }, {} as Record<string, string>);
        
        // Sort events by count for better readability in tooltip
        const sortedEvents = Object.entries(originalEvents).sort(([, a]: any, [, b]: any) => b.count - a.count);

        return (
            <div className="p-3 bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-lg shadow-lg text-sm animate-fade-in">
                <p className="label text-gray-200 font-bold mb-2">{timestamp}</p>
                <ul className="space-y-1">
                    {sortedEvents.map(([name, data]: [string, any]) => {
                        const color = colorMap[name] || '#ccc';
                        return (
                            <li key={name} className="flex justify-between items-center text-xs">
                                <span className="flex items-center">
                                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                                    <span className="text-gray-300 mr-2">{name}:</span>
                                </span>
                                <span className="font-semibold text-gray-100">{data.count.toLocaleString()} waits ({data.latency.toLocaleString()}ms)</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
    return null;
};

export const ActiveSessionWaitChart: React.FC<ActiveSessionWaitChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-[400px] text-gray-500">No wait event history available.</div>;
    }

    const allEventNames = React.useMemo(() => 
        Array.from(new Set(data.flatMap(p => Object.keys(p.events)))).sort()
    , [data]);

    const chartData = React.useMemo(() => 
        data.map(point => {
            const entry: { [key: string]: any } = {
                timestamp: new Date(point.timestamp).getTime(),
                originalEvents: point.events
            };
            for (const eventName of allEventNames) {
                entry[eventName] = point.events[eventName]?.count || 0;
            }
            return entry;
        })
    , [data, allEventNames]);

    const tickFormatter = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 50 }}>
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
                    <YAxis
                        stroke="#9CA3AF"
                        allowDecimals={false}
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Active Sessions Waiting', angle: -90, position: 'insideLeft', fill: '#9CA3AF', dy: 50 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ bottom: 0, fontSize: '10px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }} />
                    {allEventNames.map((name, index) => (
                        <Area
                            key={name}
                            type="monotone"
                            dataKey={name}
                            stackId="1"
                            stroke={colors[index % colors.length]}
                            fill={colors[index % colors.length]}
                            fillOpacity={0.6}
                            name={name}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};