import React, { useState, useMemo } from 'react';
import { OsProcess } from '../types';
import { Cpu, MemoryStick, HardDrive, Wifi } from 'lucide-react';

type ProcessTab = 'cpu' | 'memory' | 'io' | 'network';

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 whitespace-nowrap pb-3 px-3 border-b-2 font-medium text-sm transition-colors ${
      isActive
        ? 'border-blue-400 text-blue-300'
        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
    }`}
    role="tab"
    aria-selected={isActive}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export const TopOsProcesses: React.FC<{ processes: OsProcess[] }> = ({ processes }) => {
  const [activeTab, setActiveTab] = useState<ProcessTab>('cpu');

  const { sortedData, columns } = useMemo(() => {
    let sortedData: OsProcess[] = [];
    let columns: { header: string; accessor: (p: OsProcess) => React.ReactNode }[] = [];
    
    const baseColumns = [
      { header: 'PID', accessor: (p: OsProcess) => p.pid },
      { header: 'User', accessor: (p: OsProcess) => p.user },
      { header: 'Command', accessor: (p: OsProcess) => <span className="font-mono text-xs">{p.command}</span> },
    ];

    switch (activeTab) {
      case 'memory':
        sortedData = [...processes].sort((a, b) => b.memPercent - a.memPercent);
        columns = [
          { header: 'Mem %', accessor: (p: OsProcess) => p.memPercent.toFixed(1) },
          ...baseColumns,
        ];
        break;
      case 'io':
        sortedData = [...processes].sort((a, b) => (b.ioReadKb + b.ioWriteKb) - (a.ioReadKb + a.ioWriteKb));
        columns = [
          { header: 'Read (KB/s)', accessor: (p: OsProcess) => p.ioReadKb.toFixed(0) },
          { header: 'Write (KB/s)', accessor: (p: OsProcess) => p.ioWriteKb.toFixed(0) },
          ...baseColumns,
        ];
        break;
      case 'network':
        sortedData = [...processes].sort((a, b) => (b.netSentKb + b.netRecvKb) - (a.netSentKb + a.netRecvKb));
        columns = [
          { header: 'Sent (KB/s)', accessor: (p: OsProcess) => p.netSentKb.toFixed(0) },
          { header: 'Recv (KB/s)', accessor: (p: OsProcess) => p.netRecvKb.toFixed(0) },
          ...baseColumns,
        ];
        break;
      case 'cpu':
      default:
        sortedData = [...processes].sort((a, b) => b.cpuPercent - a.cpuPercent);
        columns = [
          { header: 'CPU %', accessor: (p: OsProcess) => p.cpuPercent.toFixed(1) },
          ...baseColumns,
        ];
        break;
    }
    return { sortedData, columns };
  }, [processes, activeTab]);

  return (
    <div>
      <div className="border-b border-gray-700/50 mb-4">
        <nav className="-mb-px flex space-x-2 md:space-x-6" aria-label="Tabs" role="tablist">
          <TabButton label="CPU" icon={<Cpu size={16} />} isActive={activeTab === 'cpu'} onClick={() => setActiveTab('cpu')} />
          <TabButton label="Memory" icon={<MemoryStick size={16} />} isActive={activeTab === 'memory'} onClick={() => setActiveTab('memory')} />
          <TabButton label="I/O" icon={<HardDrive size={16} />} isActive={activeTab === 'io'} onClick={() => setActiveTab('io')} />
          <TabButton label="Network" icon={<Wifi size={16} />} isActive={activeTab === 'network'} onClick={() => setActiveTab('network')} />
        </nav>
      </div>
      
      <div className="overflow-x-auto max-h-80" role="tabpanel">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
            <tr>
              {columns.map(col => (
                <th key={col.header} scope="col" className="px-4 py-3 whitespace-nowrap">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((process) => (
              <tr key={process.pid} className="border-b border-gray-700 hover:bg-gray-700/30">
                {columns.map(col => (
                  <td key={col.header} className="px-4 py-2 whitespace-nowrap">{col.accessor(process)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
