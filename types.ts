export enum Status {
  UP = 'UP',
  DOWN = 'DOWN',
  WARNING = 'WARNING',
}

export interface Customer {
  id: string;
  name: string;
  databases: Database[];
}

export interface WaitEventHistoryPoint {
  timestamp: string;
  events: {
    [eventName: string]: {
      count: number;
      latency: number;
    };
  };
}

export interface OsProcess {
  pid: number;
  user: string;
  cpuPercent: number;
  memPercent: number;
  ioReadKb: number;
  ioWriteKb: number;
  netSentKb: number;
  netRecvKb: number;
  command: string;
}

export interface Database {
  id:string;
  name: string;
  version: string;
  os: 'Linux' | 'Windows' | 'Solaris';
  edition: 'Enterprise' | 'Standard';
  dbStatus: Status;
  osStatus: Status;
  summary: {
    cpuUsage: number;
    memoryUsage: number;
    activeSessions: number;
    dbUptime: string;
    osUptime: string;
  };
  dbInfo: {
    patchDetails: string;
    sgaMb: number;
    pgaMb: number;
    components: { name: string; status: string }[];
  };
  serverInfo: {
    totalMemoryGb: number;
    cpuCores: number;
    osRelease: string;
    swapMemoryGb: number;
  };
  details: {
    osMetrics: OsMetrics;
    waitEvents: WaitEvent[];
    waitEventHistory: WaitEventHistoryPoint[];
    activeSessions: ActiveSession[];
    alertLog: AlertLogEntry[];
    rmanBackups: RmanBackup[];
    tablespaces: Tablespace[];
    diskUsage: DiskUsage[];
    activeSessionHistory: TimeSeriesData[];
    topOsProcesses: OsProcess[];
  };
}

export interface OsMetrics {
  cpu: TimeSeriesData[];
  memory: TimeSeriesData[];
  io: TimeSeriesData[];
  network: TimeSeriesData[];
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface WaitEvent {
  event: string;
  waits: number;
  totalWaitTime: number;
}

export interface ActiveSession {
  instId: number;
  sid: number;
  username: string;
  sqlId: string;
  status: string;
  waitEvent: string; // Corresponds to 'event'
  lastCallEt: number; // Corresponds to 'et'
  rowWaitObj: number; // Corresponds to 'obj'
  blockingSession: number | null; // Corresponds to 'bs'
  blockingInstance: number | null; // Corresponds to 'bi'
  module: string;
  machine: string;
  program: string;
  clientInfo: string;
}

export interface AlertLogEntry {
  timestamp: string;
  message: string;
}

export interface RmanBackup {
  startTime: string;
  endTime: string;
  status: 'COMPLETED' | 'FAILED' | 'RUNNING';
  sizeGb: number;
}

export interface Tablespace {
  name: string;
  sizeMb: number;
  usedMb: number;
  maxSizeMb: number;
}

export interface DiskUsage {
  mountPoint: string;
  totalGb: number;
  usedGb: number;
}