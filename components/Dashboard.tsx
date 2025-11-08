import React from 'react';
import { Database } from '../types';
import { Header } from './Header';
import { DatabaseDetail } from './DatabaseDetail';

interface DashboardProps {
  database: Database;
}

export const Dashboard: React.FC<DashboardProps> = ({ database }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Header summary={database.summary} dbName={database.name} os={database.os} />
      <DatabaseDetail details={database.details} edition={database.edition} />
    </div>
  );
};