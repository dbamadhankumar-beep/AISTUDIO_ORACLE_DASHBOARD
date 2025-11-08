import React from 'react';
import { Database, Status } from '../../types';
import { Cpu, MemoryStick, Users, ArrowRightCircle, Info } from 'lucide-react';
import { Card } from './Card';

interface DatabaseCardProps {
  database: Database;
  customerName: string;
  onSelect: () => void;
  onShowInfo: () => void;
}

const StatusDisplay: React.FC<{ label: string; status: Status }> = ({ label, status }) => {
  const isUp = status === Status.UP;
  const color = isUp ? 'text-green-400' : status === Status.WARNING ? 'text-yellow-400' : 'text-red-400';
  const bgColor = isUp ? 'bg-green-500' : status === Status.WARNING ? 'bg-yellow-500' : 'bg-red-500';
  const animation = !isUp ? 'animate-pulse-fast' : '';

  return (
    <div className="flex items-center space-x-2">
      <span className={`w-2.5 h-2.5 rounded-full ${bgColor} ${animation}`}></span>
      <span className="text-sm text-gray-300">{label}:</span>
      <span className={`font-semibold ${color}`}>{status}</span>
    </div>
  );
};

const MetricBar: React.FC<{ icon: React.ReactNode; value: number; label: string }> = ({ icon, value, label }) => {
    const percentage = Math.min(100, Math.max(0, value));
    const bgColor = percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-blue-500';

    return (
        <div>
            <div className="flex justify-between items-center text-sm mb-1">
                <div className="flex items-center space-x-2 text-gray-300">
                    {icon}
                    <span>{label}</span>
                </div>
                <span className="font-semibold">{value.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className={`${bgColor} h-2 rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export const DatabaseCard: React.FC<DatabaseCardProps> = React.memo(({ database, customerName, onSelect, onShowInfo }) => {
  return (
    <div className="hover:scale-105 hover:shadow-2xl transition-transform duration-300">
        <Card title={database.name} className="h-full flex flex-col">
            <div className="flex-grow space-y-4">
                <p className="text-xs text-gray-400 -mt-2 mb-2">{customerName}</p>
                <div className="flex justify-between items-center bg-gray-900/40 p-2 rounded-lg">
                    <StatusDisplay label="DB" status={database.dbStatus} />
                    <StatusDisplay label="OS" status={database.osStatus} />
                </div>
                
                <MetricBar icon={<Cpu size={16} />} label="CPU Usage" value={database.summary.cpuUsage} />
                <MetricBar icon={<MemoryStick size={16} />} label="Memory Usage" value={database.summary.memoryUsage} />

                <div className="flex items-center space-x-2 text-gray-300 pt-2">
                    <Users size={16} />
                    <span>Active Sessions:</span>
                    <span className="font-bold text-lg text-white">{database.summary.activeSessions}</span>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
                 <button 
                    onClick={onShowInfo}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={`Show info for ${database.name}`}
                >
                    <Info size={20} />
                </button>
                <button 
                    onClick={onSelect}
                    className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                    <span>View Details</span>
                    <ArrowRightCircle size={18} />
                </button>
            </div>
        </Card>
    </div>
  );
});
