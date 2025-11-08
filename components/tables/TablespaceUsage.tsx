
import React from 'react';
import { Tablespace } from '../../types';

interface TablespaceUsageProps {
  data: Tablespace[];
}

const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => {
    const bgColor = percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500';
    return (
        <div className="w-full bg-gray-600 rounded-full h-2.5">
            <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

export const TablespaceUsage: React.FC<TablespaceUsageProps> = ({ data }) => {
    const sortedData = [...data].sort((a, b) => {
        const usageA = (a.usedMb / a.maxSizeMb) * 100;
        const usageB = (b.usedMb / b.maxSizeMb) * 100;
        return usageB - usageA;
    });

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
      {sortedData.map((ts) => {
        const percentage = ts.maxSizeMb > 0 ? (ts.usedMb / ts.maxSizeMb) * 100 : 0;
        return (
          <div key={ts.name}>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="font-medium text-gray-300">{ts.name}</span>
              <span className="text-gray-400">{percentage.toFixed(2)}%</span>
            </div>
            <ProgressBar percentage={percentage} />
            <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                <span>{ts.usedMb.toLocaleString()}MB Used</span>
                <span>{ts.maxSizeMb.toLocaleString()}MB Max</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
