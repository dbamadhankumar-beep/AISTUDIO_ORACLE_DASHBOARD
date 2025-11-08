
import React from 'react';
import { AlertLogEntry } from '../../types';

interface AlertLogTableProps {
  data: AlertLogEntry[];
}

export const AlertLogTable: React.FC<AlertLogTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto max-h-64">
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
          <tr>
            <th scope="col" className="px-4 py-3 w-1/4">Timestamp</th>
            <th scope="col" className="px-4 py-3">Message</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/30">
              <td className="px-4 py-2 font-mono">{entry.timestamp}</td>
              <td className="px-4 py-2 font-mono text-red-400">{entry.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
