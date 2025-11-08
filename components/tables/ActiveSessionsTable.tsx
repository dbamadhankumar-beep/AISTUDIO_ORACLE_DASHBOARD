
import React from 'react';
import { ActiveSession } from '../../types';

interface ActiveSessionsTableProps {
  data: ActiveSession[];
}

export const ActiveSessionsTable: React.FC<ActiveSessionsTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto max-h-80">
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
          <tr>
            <th scope="col" className="px-4 py-3">Inst</th>
            <th scope="col" className="px-4 py-3">SID</th>
            <th scope="col" className="px-4 py-3">Username</th>
            <th scope="col" className="px-4 py-3">SQL ID</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Event</th>
            <th scope="col" className="px-4 py-3">ET (s)</th>
            <th scope="col" className="px-4 py-3">Object#</th>
            <th scope="col" className="px-4 py-3">Blocking SID</th>
            <th scope="col" className="px-4 py-3">Blocking Inst</th>
            <th scope="col" className="px-4 py-3">Module</th>
            <th scope="col" className="px-4 py-3">Machine</th>
            <th scope="col" className="px-4 py-3">Program</th>
            <th scope="col" className="px-4 py-3">Client Info</th>
          </tr>
        </thead>
        <tbody>
          {data.map((session) => (
            <tr key={`${session.instId}-${session.sid}`} className={`border-b border-gray-700 hover:bg-gray-700/30 ${session.blockingSession ? 'bg-red-900/30' : ''}`}>
              <td className="px-4 py-2">{session.instId}</td>
              <td className="px-4 py-2">{session.sid}</td>
              <td className="px-4 py-2">{session.username}</td>
              <td className="px-4 py-2 font-mono text-xs">{session.sqlId}</td>
              <td className="px-4 py-2">{session.status}</td>
              <td className="px-4 py-2">{session.waitEvent}</td>
              <td className="px-4 py-2">{session.lastCallEt}</td>
              <td className="px-4 py-2">{session.rowWaitObj !== 0 ? session.rowWaitObj : ''}</td>
              <td className={`px-4 py-2 font-bold ${session.blockingSession ? 'text-red-400' : ''}`}>{session.blockingSession}</td>
              <td className="px-4 py-2">{session.blockingInstance}</td>
              <td className="px-4 py-2">{session.module}</td>
              <td className="px-4 py-2">{session.machine}</td>
              <td className="px-4 py-2">{session.program}</td>
              <td className="px-4 py-2">{session.clientInfo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};