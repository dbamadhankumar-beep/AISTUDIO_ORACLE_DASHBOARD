
import React from 'react';
import { RmanBackup } from '../../types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface RmanBackupTableProps {
  data: RmanBackup[];
}

const BackupStatus: React.FC<{ status: RmanBackup['status'] }> = ({ status }) => {
    switch (status) {
        case 'COMPLETED':
            return <span className="flex items-center text-green-400"><CheckCircle2 size={16} className="mr-1" /> Completed</span>;
        case 'FAILED':
            return <span className="flex items-center text-red-400"><XCircle size={16} className="mr-1" /> Failed</span>;
        case 'RUNNING':
            return <span className="flex items-center text-yellow-400"><Clock size={16} className="mr-1" /> Running</span>;
        default:
            return <span>{status}</span>;
    }
};


export const RmanBackupTable: React.FC<RmanBackupTableProps> = ({ data }) => {
  const calculateDuration = (startTime: string, endTime: string): string => {
    if(!startTime || !endTime) return 'N/A';
    const start = new Date(startTime);
    const end = new Date(endTime);
    if(isNaN(start.getTime()) || isNaN(end.getTime())) return 'N/A';
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return durationHours.toFixed(2);
  };

  return (
    <div className="overflow-x-auto max-h-64">
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
          <tr>
            <th scope="col" className="px-4 py-3">Start Time</th>
            <th scope="col" className="px-4 py-3">End Time</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Size (GB)</th>
            <th scope="col" className="px-4 py-3">Duration (H)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((backup, index) => (
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/30">
              <td className="px-4 py-2">{backup.startTime}</td>
              <td className="px-4 py-2">{backup.endTime}</td>
              <td className="px-4 py-2"><BackupStatus status={backup.status} /></td>
              <td className="px-4 py-2">{backup.sizeGb.toFixed(2)}</td>
              <td className="px-4 py-2">{calculateDuration(backup.startTime, backup.endTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};