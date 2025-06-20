// src/pages/WeddingAttirePage.tsx

import React, { useState } from 'react'; // MODIFIED: Imported useState
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import VendorTable from '../components/VendorTable';
import { mockVendors } from '../data/mockVendors';
import WeddingAttireForm from '../components/WeddingAttireForm'; // MODIFIED: Import the form component
import { Vendor } from '../types/vendor'; // MODIFIED: Import the Vendor type

const WeddingAttirePage: React.FC = () => {
  // MODIFIED: State to manage the current view ('list' of vendors or 'form' for add/edit)
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  
  // MODIFIED: State to hold the specific vendor's data when editing
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // MODIFIED: Handler to switch to the form view for adding a new vendor
  const handleAddNew = () => {
    setSelectedVendor(null); // Ensure no vendor data is pre-filled
    setViewMode('form');
  };

  // MODIFIED: Handler to switch to the form view for editing an existing vendor
  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor); // Pass the selected vendor's data to the form
    setViewMode('form');
  };

  // MODIFIED: Handler to return to the list view from the form
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedVendor(null); // Clear any selected vendor data
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {/* MODIFIED: Conditionally render the table or the form based on viewMode state */}
          {viewMode === 'list' ? (
            <VendorTable
              title="Wedding Attire Management"
              vendors={mockVendors.weddingAttire}
              category="weddingAttire"
              onAddNew={handleAddNew}
              onEdit={handleEdit}
            />
          ) : (
            <WeddingAttireForm
              vendor={selectedVendor}
              mode={selectedVendor ? 'edit' : 'add'}
              onBack={handleBackToList}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default WeddingAttirePage;