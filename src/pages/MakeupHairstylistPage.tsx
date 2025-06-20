import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import VendorTable from '../components/VendorTable';
import { mockVendors } from '../data/mockVendors';
import MakeupHairstylistForm from '../components/MakeupHairstylistForm';
import { Vendor } from '../types/vendor';

const MakeupHairstylistPage: React.FC = () => {
  // MODIFICATION: State to manage the current view
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  
  // MODIFICATION: State to hold the vendor for editing
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // MODIFICATION: Handler to switch to the form view for adding a new vendor
  const handleAddNew = () => {
    setSelectedVendor(null);
    setViewMode('form');
  };

  // MODIFICATION: Handler to switch to the form view for editing
  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setViewMode('form');
  };

  // MODIFICATION: Handler to return to the list view
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedVendor(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {/* MODIFICATION: Conditionally render the table or the form based on viewMode */}
          {viewMode === 'list' ? (
            <VendorTable
              title="Makeup & Hairstylist Management"
              vendors={mockVendors.makeupHairstylist}
              category="makeupHairstylist"
              onAddNew={handleAddNew}
              onEdit={handleEdit}
            />
          ) : (
            <MakeupHairstylistForm
              artist={selectedVendor}
              mode={selectedVendor ? 'edit' : 'add'}
              onBack={handleBackToList}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default MakeupHairstylistPage;