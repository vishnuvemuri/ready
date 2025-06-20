// src/pages/EventPlannersPage.tsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import VendorTable from '../components/VendorTable';
import { mockVendors } from '../data/mockVendors';
import EventPlannerForm from '../components/EventPlannerForm'; // MODIFIED: Import the form component
import { Vendor } from '../types/vendor'; // MODIFIED: Import the Vendor type

const EventPlannersPage: React.FC = () => {
  // MODIFIED: State to manage the current view (list or form)
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  
  // MODIFIED: State to hold the vendor data for editing
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // MODIFIED: Handler to switch to the form view for adding a new vendor
  const handleAddNew = () => {
    setSelectedVendor(null);
    setViewMode('form');
  };

  // MODIFIED: Handler to switch to the form view for editing an existing vendor
  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setViewMode('form');
  };

  // MODIFIED: Handler to return to the list view from the form
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
          {/* MODIFIED: Conditionally render the table or the form based on viewMode */}
          {viewMode === 'list' ? (
            <VendorTable
              title="Event Planners Management"
              vendors={mockVendors.eventPlanners}
              category="eventPlanners"
              onAddNew={handleAddNew}
              onEdit={handleEdit}
            />
          ) : (
            <EventPlannerForm
              planner={selectedVendor}
              mode={selectedVendor ? 'edit' : 'add'}
              onBack={handleBackToList}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default EventPlannersPage;