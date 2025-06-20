import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import VendorTable from '../components/VendorTable';
import { mockVendors } from '../data/mockVendors';
import InvitationForm from '../components/InvitationForm';
import { Vendor } from '../types/vendor';

const InvitationCardsPage: React.FC = () => {
  // State to manage the view ('list' or 'form')
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  
  // State to hold the vendor being edited or viewed
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Function to show the form for adding a new vendor
  const handleAddNew = () => {
    setSelectedVendor(null);
    setViewMode('form');
  };

  // Function to show the form for editing an existing vendor
  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setViewMode('form');
  };

  // Function to return to the list view from the form
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
          {/* Conditionally render based on viewMode state */}
          {viewMode === 'list' ? (
            <VendorTable
              title="Invitation Cards Management"
              vendors={mockVendors.invitationCards}
              category="invitationCards"
              onAddNew={handleAddNew}
              onEdit={handleEdit}
            />
          ) : (
            <InvitationForm
              invitation={selectedVendor}
              mode={selectedVendor ? 'edit' : 'add'}
              onBack={handleBackToList}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default InvitationCardsPage;