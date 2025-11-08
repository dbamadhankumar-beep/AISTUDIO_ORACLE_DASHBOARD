import React, { useState } from 'react';
import { Customer, Database, Status } from '../types';
import { ChevronDown, ChevronRight, Database as DbIcon, LayoutDashboard, Building, Activity } from 'lucide-react';

interface SidebarProps {
  customers: Customer[];
  onSelectDb: (db: Database) => void;
  selectedDbId?: string;
  currentView: 'overview' | 'dashboard';
  onSelectOverview: () => void;
}

const StatusIndicator: React.FC<{ status: Status }> = ({ status }) => {
  const color = status === Status.UP ? 'bg-green-500' : status === Status.WARNING ? 'bg-yellow-500' : 'bg-red-500';
  const animation = status !== Status.UP ? 'animate-pulse-fast' : '';
  return <span className={`w-2.5 h-2.5 rounded-full ${color} ${animation}`}></span>;
};

export const Sidebar: React.FC<SidebarProps> = ({ customers, onSelectDb, selectedDbId, currentView, onSelectOverview }) => {
  const [openCustomers, setOpenCustomers] = useState<Record<string, boolean>>(
    customers.reduce((acc, customer) => ({ ...acc, [customer.id]: true }), {})
  );

  const toggleCustomer = (customerId: string) => {
    setOpenCustomers(prev => ({ ...prev, [customerId]: !prev[customerId] }));
  };

  return (
    <aside className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-700/50 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center space-x-2">
          <Activity className="text-teal-300" size={24}/>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">ProactiveDB</h1>
        </div>
        <p className="text-xs text-gray-400">Oracle Monitoring</p>
      </div>
      <nav className="flex-1 p-2 space-y-2">
        <button
          onClick={onSelectOverview}
          className={`w-full flex items-center space-x-2 text-left p-2 rounded-lg transition-colors ${
            currentView === 'overview' ? 'bg-blue-600/30 text-white' : 'hover:bg-gray-700/50 text-gray-300'
          }`}
        >
          <LayoutDashboard size={16} />
          <span className="font-semibold">Overview</span>
        </button>

        {customers.map(customer => (
          <div key={customer.id}>
            <button
              onClick={() => toggleCustomer(customer.id)}
              className="w-full flex items-center justify-between text-left p-2 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Building size={16} className="text-gray-400" />
                <span className="font-semibold">{customer.name}</span>
              </div>
              {openCustomers[customer.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {openCustomers[customer.id] && (
              <ul className="pl-4 mt-1 space-y-1">
                {customer.databases.map(db => (
                  <li key={db.id}>
                    <button
                      onClick={() => onSelectDb(db)}
                      className={`w-full text-left p-2 pl-3 rounded-lg flex items-center justify-between transition-colors ${
                        selectedDbId === db.id ? 'bg-blue-600/30 text-white' : 'hover:bg-gray-700/50 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <DbIcon size={14} />
                        <span className="text-sm">{db.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StatusIndicator status={db.osStatus} />
                        <StatusIndicator status={db.dbStatus} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
       <div className="p-4 mt-auto border-t border-gray-700/50 text-xs text-gray-500">
          <p>© 2024 ProactiveDB. All rights reserved.</p>
      </div>
    </aside>
  );
};