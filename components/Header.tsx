
import React from 'react';
import { Database, Cpu, MemoryStick, Users, Clock, Server } from 'lucide-react';

interface HeaderProps {
  summary: {
    cpuUsage: number;
    memoryUsage: number;
    activeSessions: number;
    dbUptime: string;
    osUptime: string;
  };
  dbName: string;
  os: string;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; unit?: string; color: string }> = ({ icon, label, value, unit, color }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl flex items-center space-x-4 border border-gray-700/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
    <div className={`p-3 rounded-full bg-gray-700/50 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xl font-bold">
        {value}
        {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
      </p>
    </div>
  </div>
);


export const Header: React.FC<HeaderProps> = React.memo(({ summary, dbName, os }) => {
  return (
    <header>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wider">Database</p>
          <h2 className="text-3xl font-bold text-white">
            {dbName}
          </h2>
        </div>
        <div className="mt-2 md:mt-0 md:text-right">
          <p className="text-sm text-gray-400 uppercase tracking-wider">Server Platform</p>
          <h3 className="text-2xl font-semibold text-gray-300">{os}</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={<Cpu size={24} />} label="CPU Usage" value={summary.cpuUsage.toFixed(1)} unit="%" color="text-cyan-400" />
        <StatCard icon={<MemoryStick size={24} />} label="Memory Usage" value={summary.memoryUsage.toFixed(1)} unit="%" color="text-purple-400" />
        <StatCard icon={<Users size={24} />} label="Active Sessions" value={summary.activeSessions} color="text-green-400" />
        <StatCard icon={<Database size={24} />} label="DB Uptime" value={summary.dbUptime} color="text-orange-400" />
        <StatCard icon={<Server size={24} />} label="OS Uptime" value={summary.osUptime} color="text-yellow-400" />
      </div>
    </header>
  );
});
