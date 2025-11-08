import React from 'react';
import { Database } from '../types';
import { Card } from './common/Card';
import { WaitEventsChart } from './charts/WaitEventsChart';
import { SingleMetricChart } from './charts/OsMetricsChart';
import { ActiveSessionsTable } from './tables/ActiveSessionsTable';
import { AlertLogTable } from './tables/AlertLogTable';
import { RmanBackupTable } from './tables/RmanBackupTable';
import { TablespaceUsage } from './tables/TablespaceUsage';
import { DiskUsageTable } from './tables/DiskUsageTable';
import { ActiveSessionCountChart } from './charts/ActiveSessionCountChart';
import { ActiveSessionWaitChart } from './charts/ActiveSessionWaitChart';
import { TopOsProcesses } from './TopOsProcesses';
import { Info, Cpu, MemoryStick, HardDrive, Wifi } from 'lucide-react';

interface DatabaseDetailProps {
  details: Database['details'];
  edition: Database['edition'];
}

export const DatabaseDetail: React.FC<DatabaseDetailProps> = React.memo(({ details, edition }) => {

  const waitChartAdornment = (
    <div className="relative group">
      <Info size={16} className="text-gray-500 hover:text-gray-300 cursor-help" />
      <div className="absolute bottom-full right-0 mb-2 w-72 p-2 bg-gray-900 text-gray-300 text-xs rounded-md border border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        Data source is simulated based on DB edition.
        <br />
        <strong className="text-blue-400">Enterprise:</strong> Simulates GV$ACTIVE_SESSION_HISTORY.
        <br />
        <strong className="text-blue-400">Standard:</strong> Simulates V$SESSION.
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Row 1: Active Session Waits Chart */}
      <Card title="Active Session Waits (Last 24 Hours)" titleAdornment={waitChartAdornment}>
        <ActiveSessionWaitChart data={details.waitEventHistory} />
      </Card>

      {/* Row 2: Active Session Count & CPU */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Active Session Count (Last 24 Hours)">
          <ActiveSessionCountChart data={details.activeSessionHistory} />
        </Card>
        <Card title="CPU Usage (Last 24 Hours)" icon={<Cpu size={16} className="text-cyan-400" />}>
            <SingleMetricChart 
                data={details.osMetrics.cpu} 
                strokeColor="#38BDF8" 
                fillColor="#38BDF8"
                title="CPU Usage"
            />
        </Card>
      </div>
      
      {/* Row 3: Memory & I/O */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Memory Usage (Last 24 Hours)" icon={<MemoryStick size={16} className="text-purple-400" />}>
            <SingleMetricChart 
                data={details.osMetrics.memory} 
                strokeColor="#A78BFA" 
                fillColor="#A78BFA"
                title="Memory Usage"
            />
        </Card>
        <Card title="I/O Utilization (Last 24 Hours)" icon={<HardDrive size={16} className="text-pink-400" />}>
            <SingleMetricChart 
                data={details.osMetrics.io} 
                strokeColor="#F472B6" 
                fillColor="#F472B6"
                title="I/O Utilization"
            />
        </Card>
      </div>

      {/* Row 4: Network & Wait Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Network Usage (Last 24 Hours)" icon={<Wifi size={16} className="text-green-400" />}>
            <SingleMetricChart 
                data={details.osMetrics.network} 
                strokeColor="#4ADE80" 
                fillColor="#4ADE80"
                title="Network"
            />
        </Card>
        <Card title="Top Wait Events">
          <WaitEventsChart data={details.waitEvents} />
        </Card>
      </div>

      {/* Top OS Processes */}
      <Card title="Top OS Processes">
        <TopOsProcesses processes={details.topOsProcesses} />
      </Card>

      {/* Full-width Row for Active Sessions Table */}
      <Card title="Active Sessions">
        <ActiveSessionsTable data={details.activeSessions} />
      </Card>

      {/* Tablespaces and Disk Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Tablespace Usage">
          <TablespaceUsage data={details.tablespaces} />
        </Card>
        <Card title="OS Disk Usage">
          <DiskUsageTable data={details.diskUsage} />
        </Card>
      </div>

      <Card title="Recent ORA- Errors (Last 2 Days)">
        <AlertLogTable data={details.alertLog} />
      </Card>
      <Card title="RMAN Backup Status (Last 7 Days)">
        <RmanBackupTable data={details.rmanBackups} />
      </Card>
    </div>
  );
});
