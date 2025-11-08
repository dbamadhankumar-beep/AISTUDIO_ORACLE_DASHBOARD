import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Overview } from './components/Overview';
import { Customer, Database } from './types';
import { fetchCustomersAndDatabases, fetchRealtimeUpdates } from './services/apiService';
import { Menu, X, Loader } from 'lucide-react';

const App: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDbId, setSelectedDbId] = useState<string | null>(null);
  const [view, setView] = useState<'overview' | 'dashboard'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const selectedDb = customers.flatMap(c => c.databases).find(db => db.id === selectedDbId) || null;

  // Fetch initial data on mount
  useEffect(() => {
    fetchCustomersAndDatabases().then(initialCustomers => {
      setCustomers(initialCustomers);
      setIsLoading(false);
    });
  }, []);

  // Poll for live data updates
  useEffect(() => {
    if (isLoading) return; // Don't start polling until initial data is loaded

    const interval = setInterval(() => {
      fetchRealtimeUpdates(customers).then(updatedCustomers => {
        setCustomers(updatedCustomers);
      });
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [isLoading, customers]);

  const handleSelectDb = (db: Database) => {
    setSelectedDbId(db.id);
    setView('dashboard');
    if(window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };
  
  const handleSelectOverview = () => {
    setSelectedDbId(null);
    setView('overview');
    if(window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
            <Loader size={48} className="animate-spin text-blue-400" />
        </div>
      );
    }
    if (view === 'overview') {
      return <Overview customers={customers} onSelectDb={handleSelectDb} />;
    }
    if (view === 'dashboard' && selectedDb) {
      return <Dashboard database={selectedDb} />;
    }
    return (
       <div className="flex items-center justify-center h-full">
          <p className="text-xl text-gray-400">Select a database to view details.</p>
       </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
       <div className={`fixed top-0 left-0 z-30 h-full transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64`}>
          <Sidebar 
            customers={customers} 
            onSelectDb={handleSelectDb} 
            selectedDbId={selectedDb?.id}
            currentView={view}
            onSelectOverview={handleSelectOverview}
          />
       </div>
       
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden p-2 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-20">
          <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
