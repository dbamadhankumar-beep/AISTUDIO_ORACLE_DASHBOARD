import { Customer, Status, WaitEvent, Database, TimeSeriesData, WaitEventHistoryPoint, OsProcess } from '../types';

const generateTimeSeries = (days: number, pointsPerHour: number, min: number, max: number): TimeSeriesData[] => {
  const data = [];
  const now = new Date();
  for (let i = days * 24 * pointsPerHour; i > 0; i--) {
    const timestamp = new Date(now.getTime() - i * (60 / pointsPerHour) * 60 * 1000).toISOString();
    data.push({ timestamp, value: min + Math.random() * (max - min) });
  }
  return data;
};

const waitEvents: WaitEvent[] = [
    { event: 'db file sequential read', waits: 150320, totalWaitTime: 98345 },
    { event: 'log file sync', waits: 80123, totalWaitTime: 76543 },
    { event: 'db file scattered read', waits: 45678, totalWaitTime: 65432 },
    { event: 'latch: cache buffers chains', waits: 30234, totalWaitTime: 54321 },
    { event: 'library cache lock', waits: 15678, totalWaitTime: 43210 },
    { event: 'enq: TX - row lock contention', waits: 5432, totalWaitTime: 32109 },
];

const eventNamesForHistory = [
    'db file sequential read',
    'log file sync',
    'db file scattered read',
    'latch: cache buffers chains',
    'library cache lock',
];

const generateWaitEventHistory = (hours: number, pointsPerHour: number): WaitEventHistoryPoint[] => {
    const data: WaitEventHistoryPoint[] = [];
    const now = new Date();
    for (let i = hours * pointsPerHour; i > 0; i--) {
        const timestamp = new Date(now.getTime() - i * (60 / pointsPerHour) * 60 * 1000).toISOString();
        const events: { [eventName: string]: { count: number; latency: number } } = {};
        eventNamesForHistory.forEach(name => {
            if (Math.random() > 0.3) { // not all events appear at all times
                events[name] = {
                    count: Math.floor(Math.random() * 20) + 1,
                    latency: Math.floor(Math.random() * 50) + 5
                };
            }
        });
        if (Object.keys(events).length > 0) {
            data.push({ timestamp, events });
        }
    }
    return data;
};

const generateTopOsProcesses = (os: string): OsProcess[] => {
  const isWindows = os.includes('win');
  const oracleProcess = isWindows ? 'oracle.exe' : 'ora_pmon_PROD';
  const systemProcesses = isWindows
    ? ['svchost.exe', 'lsass.exe', 'services.exe', 'System']
    : ['systemd', 'sshd', 'rsyslogd', 'tuned'];

  const processes: OsProcess[] = [
    { pid: 1234, user: isWindows ? 'SYSTEM' : 'oracle', cpuPercent: Math.random() * 20 + 10, memPercent: Math.random() * 15 + 5, ioReadKb: Math.random() * 500, ioWriteKb: Math.random() * 800, netSentKb: Math.random() * 50, netRecvKb: Math.random() * 100, command: oracleProcess },
    { pid: 5678, user: isWindows ? 'SYSTEM' : 'oracle', cpuPercent: Math.random() * 15 + 5, memPercent: Math.random() * 10 + 2, ioReadKb: Math.random() * 200, ioWriteKb: Math.random() * 300, netSentKb: Math.random() * 20, netRecvKb: Math.random() * 50, command: isWindows ? 'oracle.exe' : 'ora_dbw0_PROD' },
    { pid: 9101, user: isWindows ? 'SYSTEM' : 'root', cpuPercent: Math.random() * 5, memPercent: Math.random() * 2, ioReadKb: Math.random() * 10, ioWriteKb: Math.random() * 50, netSentKb: Math.random() * 80, netRecvKb: Math.random() * 120, command: systemProcesses[0] },
    { pid: 1121, user: isWindows ? 'NETWORK SERVICE' : 'root', cpuPercent: Math.random() * 2, memPercent: Math.random() * 1, ioReadKb: Math.random() * 5, ioWriteKb: Math.random() * 10, netSentKb: Math.random() * 5, netRecvKb: Math.random() * 10, command: systemProcesses[1] },
    { pid: 3141, user: 'appuser', cpuPercent: Math.random() * 8, memPercent: Math.random() * 5, ioReadKb: Math.random() * 10, ioWriteKb: Math.random() * 5, netSentKb: Math.random() * 200, netRecvKb: Math.random() * 300, command: isWindows ? 'tomcat9.exe' : '/usr/bin/java -jar app.jar' },
    { pid: 5161, user: 'backup', cpuPercent: Math.random() * 25, memPercent: Math.random() * 3, ioReadKb: Math.random() * 1200, ioWriteKb: Math.random() * 200, netSentKb: Math.random() * 1, netRecvKb: Math.random() * 1, command: isWindows ? 'robocopy.exe' : 'rsync' },
    { pid: 7181, user: 'monitoring', cpuPercent: Math.random() * 1, memPercent: Math.random() * 0.5, ioReadKb: Math.random() * 1, ioWriteKb: Math.random() * 1, netSentKb: Math.random() * 10, netRecvKb: Math.random() * 15, command: 'agent.bin' },
  ];
  return processes;
};

const generateDbDetails = (id: string): Database['details'] => ({
    osMetrics: {
        cpu: generateTimeSeries(2, 6, 10, 60),
        memory: generateTimeSeries(2, 6, 40, 85),
        io: generateTimeSeries(2, 6, 5, 30),
        network: generateTimeSeries(2, 6, 1, 15),
    },
    activeSessionHistory: generateTimeSeries(2, 6, 5, 50),
    waitEvents,
    waitEventHistory: generateWaitEventHistory(24, 12), // 24 hours, data every 5 mins
    activeSessions: [
        { instId: 1, sid: 101, username: 'SYS', sqlId: 'g2zqk2s1x7v8m', status: 'ACTIVE', waitEvent: 'db file sequential read', lastCallEt: 3, rowWaitObj: 12345, blockingSession: null, blockingInstance: null, module: 'SQL*Plus', machine: 'db-server-01', program: 'sqlplus@db-server-01 (TNS V1-V3)', clientInfo: '' },
        { instId: 1, sid: 108, username: 'APP_USER', sqlId: '8vjw7ykmx5q3n', status: 'ACTIVE', waitEvent: 'enq: TX - row lock contention', lastCallEt: 12, rowWaitObj: 98765, blockingSession: 109, blockingInstance: 1, module: 'JDBC Thin Client', machine: 'app-server-05', program: 'JDBC Thin Client', clientInfo: 'Customer Order Screen' },
        { instId: 1, sid: 109, username: 'APP_USER', sqlId: 'd9ksw4mz0y1p2', status: 'ACTIVE', waitEvent: 'latch: cache buffers chains', lastCallEt: 12, rowWaitObj: 0, blockingSession: null, blockingInstance: null, module: 'JDBC Thin Client', machine: 'app-server-05', program: 'JDBC Thin Client', clientInfo: 'Customer Order Screen' },
        { instId: 2, sid: 205, username: 'REPORT_USER', sqlId: '', status: 'INACTIVE', waitEvent: 'SQL*Net message from client', lastCallEt: 350, rowWaitObj: 0, blockingSession: null, blockingInstance: null, module: 'TOAD', machine: 'dba-workstation-01', program: 'Toad.exe', clientInfo: '' },
        { instId: 2, sid: 210, username: 'SYS', sqlId: '1yq2z8kfg7h0s', status: 'ACTIVE', waitEvent: 'log file sync', lastCallEt: 1, rowWaitObj: 0, blockingSession: null, blockingInstance: null, module: 'Data Pump Worker', machine: 'db-server-02', program: 'oracle@db-server-02 (DW00)', clientInfo: '' },
    ],
    alertLog: [
        { timestamp: new Date(Date.now() - 3600000).toLocaleString(), message: 'ORA-00600: internal error code, arguments: [kcrfr_update_nab_less_than_odr], [], [], [], [], [], [], []' },
        { timestamp: new Date(Date.now() - 7200000).toLocaleString(), message: 'ORA-1652: unable to extend temp segment by 128 in tablespace TEMP' },
        { timestamp: new Date(Date.now() - 86400000).toLocaleString(), message: 'ORA-04031: unable to allocate 4096 bytes of shared memory' },
    ],
    rmanBackups: [
        { startTime: new Date(Date.now() - 86400000).toLocaleString(), endTime: new Date(Date.now() - 86000000).toLocaleString(), status: 'COMPLETED', sizeGb: 120.5 },
        { startTime: new Date(Date.now() - 2*86400000).toLocaleString(), endTime: new Date(Date.now() - 2*86000000).toLocaleString(), status: 'COMPLETED', sizeGb: 15.2 },
        { startTime: new Date(Date.now() - 3*86400000).toLocaleString(), endTime: new Date(Date.now() - 3*85000000).toLocaleString(), status: 'FAILED', sizeGb: 115.0 },
         { startTime: new Date(Date.now() - 4*86400000).toLocaleString(), endTime: new Date(Date.now() - 4*86000000).toLocaleString(), status: 'COMPLETED', sizeGb: 119.8 },
    ],
    tablespaces: [
        { name: 'SYSTEM', sizeMb: 800, usedMb: 750, maxSizeMb: 1024 },
        { name: 'SYSAUX', sizeMb: 1200, usedMb: 900, maxSizeMb: 2048 },
        { name: 'UNDOTBS1', sizeMb: 2048, usedMb: 1800, maxSizeMb: 4096 },
        { name: 'USERS', sizeMb: 512, usedMb: 128, maxSizeMb: 1024 },
        { name: 'APPDATA', sizeMb: 10240, usedMb: 9800, maxSizeMb: 12288 },
        { name: 'APPINDEX', sizeMb: 8192, usedMb: 7500, maxSizeMb: 10240 },
    ],
    diskUsage: id.includes('win') ? [
        { mountPoint: 'C:', totalGb: 256, usedGb: 180 },
        { mountPoint: 'D:', totalGb: 1024, usedGb: 950 },
    ] : [
        { mountPoint: '/', totalGb: 100, usedGb: 65 },
        { mountPoint: '/u01', totalGb: 500, usedGb: 410 },
        { mountPoint: '/data', totalGb: 2048, usedGb: 1500 },
    ],
    topOsProcesses: generateTopOsProcesses(id),
});

const initialCustomers: Customer[] = [
  {
    id: 'cust1',
    name: 'Global Tech Inc.',
    databases: [
      {
        id: 'db1-linux',
        name: 'PROD_CRM_DB',
        version: '19c',
        os: 'Linux',
        edition: 'Enterprise',
        dbStatus: Status.UP,
        osStatus: Status.UP,
        summary: { cpuUsage: 45.2, memoryUsage: 78.5, activeSessions: 12, dbUptime: '120d 5h', osUptime: '122d 2h' },
        dbInfo: { patchDetails: '19.15.0.0.220419', sgaMb: 8192, pgaMb: 2048, components: [{ name: 'Oracle JVM', status: 'VALID' }, { name: 'Oracle Text', status: 'VALID' }, { name: 'Oracle XML DB', status: 'VALID' }, { name: 'Oracle Application Express', status: 'VALID' },], },
        serverInfo: { totalMemoryGb: 64, cpuCores: 16, osRelease: 'Red Hat Enterprise Linux Server 7.9', swapMemoryGb: 32, },
        details: generateDbDetails('linux'),
      },
      {
        id: 'db2-win',
        name: 'DEV_FIN_DB',
        version: '12c',
        os: 'Windows',
        edition: 'Standard',
        dbStatus: Status.UP,
        osStatus: Status.UP,
        summary: { cpuUsage: 15.8, memoryUsage: 65.1, activeSessions: 4, dbUptime: '12d 1h', osUptime: '12d 3h' },
        dbInfo: { patchDetails: '12.2.0.1.210720', sgaMb: 4096, pgaMb: 1024, components: [{ name: 'Oracle JVM', status: 'VALID' }, { name: 'Oracle XML DB', status: 'VALID' },], },
        serverInfo: { totalMemoryGb: 32, cpuCores: 8, osRelease: 'Windows Server 2016 Standard', swapMemoryGb: 64, },
        details: generateDbDetails('win'),
      },
    ],
  },
  {
    id: 'cust2',
    name: 'Innovate Solutions',
    databases: [
      {
        id: 'db3-solaris',
        name: 'HR_PROD',
        version: '11g',
        os: 'Solaris',
        edition: 'Standard',
        dbStatus: Status.DOWN,
        osStatus: Status.UP,
        summary: { cpuUsage: 0, memoryUsage: 0, activeSessions: 0, dbUptime: '0d 0h', osUptime: '300d 10h' },
        dbInfo: { patchDetails: '11.2.0.4.190416', sgaMb: 2048, pgaMb: 512, components: [{ name: 'Oracle XML DB', status: 'VALID' },], },
        serverInfo: { totalMemoryGb: 128, cpuCores: 32, osRelease: 'Oracle Solaris 11.4', swapMemoryGb: 256, },
        details: generateDbDetails('solaris'),
      },
      {
        id: 'db4-linux',
        name: 'REPORTING_WH',
        version: '19c',
        os: 'Linux',
        edition: 'Enterprise',
        dbStatus: Status.UP,
        osStatus: Status.WARNING,
        summary: { cpuUsage: 85.1, memoryUsage: 92.3, activeSessions: 35, dbUptime: '50d 8h', osUptime: '50d 9h' },
        dbInfo: { patchDetails: '19.18.0.0.230117', sgaMb: 16384, pgaMb: 8192, components: [{ name: 'Oracle JVM', status: 'VALID' }, { name: 'Oracle Text', status: 'VALID' }, { name: 'Oracle XML DB', status: 'VALID' }, { name: 'Oracle Real Application Clusters', status: 'VALID' },], },
        serverInfo: { totalMemoryGb: 128, cpuCores: 24, osRelease: 'Oracle Linux Server 8.5', swapMemoryGb: 64, },
        details: generateDbDetails('linux-heavy'),
      },
    ],
  },
];

// This function returns the static structure of customers and databases.
// In a real app, this would be the response from GET /api/customers.
export const getInitialCustomers = (): Customer[] => {
  return JSON.parse(JSON.stringify(initialCustomers)); // Deep copy to prevent mutation
};

// This function simulates a live data update from an agent.
export const getLiveMetricsUpdate = (db: Database): Database => {
  const generateNewPoint = (lastValue: number, min: number, max: number, volatility: number) => {
    const newValue = lastValue + (Math.random() - 0.5) * volatility;
    return Math.min(max, Math.max(min, newValue));
  };
  
  const lastCpu = db.details.osMetrics.cpu[db.details.osMetrics.cpu.length - 1]?.value || 45;
  const lastMem = db.details.osMetrics.memory[db.details.osMetrics.memory.length - 1]?.value || 78;
  const lastIo = db.details.osMetrics.io[db.details.osMetrics.io.length - 1]?.value || 10;
  const lastNet = db.details.osMetrics.network[db.details.osMetrics.network.length - 1]?.value || 5;
  const lastActiveSession = db.details.activeSessionHistory[db.details.activeSessionHistory.length - 1]?.value || 12;

  const newCpuValue = generateNewPoint(lastCpu, 5, 100, 5);
  const newMemValue = generateNewPoint(lastMem, 10, 100, 3);
  const newIoValue = generateNewPoint(lastIo, 0, 100, 4);
  const newNetValue = generateNewPoint(lastNet, 0, 100, 2);
  const newActiveSessionValue = Math.max(0, Math.floor(generateNewPoint(lastActiveSession, 2, 60, 4)));
  
  const newTimestamp = new Date().toISOString();

  const newCpuSeries = [...db.details.osMetrics.cpu.slice(1), { timestamp: newTimestamp, value: newCpuValue }];
  const newMemSeries = [...db.details.osMetrics.memory.slice(1), { timestamp: newTimestamp, value: newMemValue }];
  const newIoSeries = [...db.details.osMetrics.io.slice(1), { timestamp: newTimestamp, value: newIoValue }];
  const newNetSeries = [...db.details.osMetrics.network.slice(1), { timestamp: newTimestamp, value: newNetValue }];
  const newActiveSessionSeries = [...db.details.activeSessionHistory.slice(1), { timestamp: newTimestamp, value: newActiveSessionValue }];

  return {
    ...db,
    dbStatus: Math.random() > 0.95 ? Status.DOWN : Status.UP,
    osStatus: Math.random() > 0.98 ? Status.DOWN : Status.UP,
    summary: {
      ...db.summary,
      cpuUsage: newCpuValue,
      memoryUsage: newMemValue,
      activeSessions: newActiveSessionValue,
    },
    details: {
      ...db.details,
      osMetrics: {
        cpu: newCpuSeries,
        memory: newMemSeries,
        io: newIoSeries,
        network: newNetSeries
      },
      activeSessionHistory: newActiveSessionSeries,
    }
  };
};
