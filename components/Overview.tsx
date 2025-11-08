import React, { useState } from 'react';
import { Customer, Database } from '../types';
import { DatabaseCard } from './common/DatabaseCard';
import { Modal } from './common/Modal';
import { InfoModal } from './InfoModal';

interface OverviewProps {
  customers: Customer[];
  onSelectDb: (db: Database) => void;
}

export const Overview: React.FC<OverviewProps> = ({ customers, onSelectDb }) => {
  const [infoModalDb, setInfoModalDb] = useState<Database & { customerName: string } | null>(null);

  const allDatabases = customers.flatMap(customer => 
    customer.databases.map(db => ({ ...db, customerName: customer.name }))
  );

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-6">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allDatabases.map(db => (
          <DatabaseCard 
            key={db.id} 
            database={db} 
            customerName={db.customerName}
            onSelect={() => onSelectDb(db)}
            onShowInfo={() => setInfoModalDb(db)}
          />
        ))}
      </div>

      {infoModalDb && (
        <Modal 
          isOpen={!!infoModalDb} 
          onClose={() => setInfoModalDb(null)}
          title={`${infoModalDb.name} - Details`}
        >
          <InfoModal database={infoModalDb} customerName={infoModalDb.customerName} />
        </Modal>
      )}
    </div>
  );
};