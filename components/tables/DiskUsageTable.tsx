
import React from 'react';
import { DiskUsage } from '../../types';

interface DiskUsageTableProps {
  data: DiskUsage[];
}

const DiskProgressBar: React.FC<{ used: number, total: number }> = ({ used, total }) => {
    const percentage = total > 0 ? (used / total) * 100 : 0;
    const bgColor = percentage > 90 ? 'bg-red-600' : percentage > 75 ? 'bg-yellow-500' : 'bg-blue-500';

    return (
        <div className="w-full bg-gray-600 rounded-full h-4 relative">
            <div className={`${bgColor} h-4 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white text-shadow-sm">
                {percentage.toFixed(1)}%
            </span>
        </div>
    );
};


export const DiskUsageTable: React.FC<DiskUsageTableProps> = ({ data }) => {
  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
      {data.map((disk) => (
        <div key={disk.mountPoint}>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-300">{disk.mountPoint}</span>
                <span className="text-sm text-gray-400">{disk.usedGb.toFixed(1)}GB / {disk.totalGb.toFixed(1)}GB</span>
            </div>
          <DiskProgressBar used={disk.usedGb} total={disk.totalGb} />
        </div>
      ))}
    </div>
  );
};
