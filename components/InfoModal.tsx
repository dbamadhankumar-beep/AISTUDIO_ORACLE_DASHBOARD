import React, { useState } from 'react';
import { Database } from '../types';

interface InfoModalProps {
  database: Database;
  customerName: string;
}

type Tab = 'db' | 'server';

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-700/50">
    <dt className="text-sm font-medium text-gray-400">{label}</dt>
    <dd className="text-sm text-gray-200 col-span-2">{children}</dd>
  </div>
);

export const InfoModal: React.FC<InfoModalProps> = ({ database, customerName }) => {
  const [activeTab, setActiveTab] = useState<Tab>('db');

  const usedMemoryGb = (database.serverInfo.totalMemoryGb * (database.summary.memoryUsage / 100)).toFixed(1);

  const renderDbInfo = () => (
    <dl>
      <InfoRow label="DB Name">{database.name}</InfoRow>
      <InfoRow label="Customer">{customerName}</InfoRow>
      <InfoRow label="Status">{database.dbStatus}</InfoRow>
      <InfoRow label="Uptime">{database.summary.dbUptime}</InfoRow>
      <InfoRow label="Edition">{database.edition}</InfoRow>
      <InfoRow label="Version">{database.version}</InfoRow>
      <InfoRow label="Patch Details">{database.dbInfo.patchDetails}</InfoRow>
      <InfoRow label="SGA Allocated">{database.dbInfo.sgaMb.toLocaleString()} MB</InfoRow>
      <InfoRow label="PGA Allocated">{database.dbInfo.pgaMb.toLocaleString()} MB</InfoRow>
      <InfoRow label="Components">
        <ul className="list-disc pl-5 space-y-1">
            {database.dbInfo.components.map(c => <li key={c.name}>{c.name} ({c.status})</li>)}
        </ul>
      </InfoRow>
    </dl>
  );

  const renderServerInfo = () => (
    <dl>
        <InfoRow label="OS Platform">{database.os}</InfoRow>
        <InfoRow label="OS Release">{database.serverInfo.osRelease}</InfoRow>
        <InfoRow label="OS Uptime">{database.summary.osUptime}</InfoRow>
        <InfoRow label="CPU Cores">{database.serverInfo.cpuCores}</InfoRow>
        <InfoRow label="CPU Usage">{database.summary.cpuUsage.toFixed(1)}%</InfoRow>
        <InfoRow label="Total Memory">{database.serverInfo.totalMemoryGb} GB</InfoRow>
        <InfoRow label="Used Memory">{usedMemoryGb} GB ({database.summary.memoryUsage.toFixed(1)}%)</InfoRow>
        <InfoRow label="Swap Memory">{database.serverInfo.swapMemoryGb} GB</InfoRow>
    </dl>
  );

  return (
    <div>
      <div className="border-b border-gray-700/50 mb-4">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('db')}
            className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'db'
                ? 'border-blue-400 text-blue-300'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            }`}
          >
            DB Info
          </button>
          <button
            onClick={() => setActiveTab('server')}
            className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'server'
                ? 'border-blue-400 text-blue-300'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            }`}
          >
            Server Info
          </button>
        </nav>
      </div>
      <div>
        {activeTab === 'db' ? renderDbInfo() : renderServerInfo()}
      </div>
    </div>
  );
};