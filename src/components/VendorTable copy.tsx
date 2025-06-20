import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Vendor } from '../types/vendor';
import VenueForm from './VenueForm';
import JewelryForm from './JewelryForm';
import PhotographyForm from './PhotographyForm';
import InvitationForm from './InvitationForm';
import MakeupHairstylistForm from './MakeupHairstylistForm';
import EventPlannerForm from './EventPlannerForm';
import EventAnchorForm from './EventAnchorForm';
import WeddingAttireForm from './WeddingAttireForm';

interface VendorTableProps {
  title: string;
  vendors: Vendor[];
  onView?: (vendor: Vendor) => void;
  onEdit?: (vendor: Vendor) => void;
  onDelete?: (vendor: Vendor) => void;
  onAddNew?: () => void;
  category?: string;
}

const VendorTable: React.FC<VendorTableProps> = ({
  title,
  vendors,
  onView,
  onEdit,
  onDelete,
  onAddNew,
  category
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add');
  const itemsPerPage = 9;

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVendors = filteredVendors.slice(startIndex, endIndex);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleView = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setFormMode('view');
    setShowForm(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleDelete = (vendor: Vendor) => {
    if (window.confirm(`Are you sure you want to delete ${vendor.name}? This action cannot be undone.`)) {
      // In a real app, this would make an API call to delete the vendor
      console.log('Delete vendor:', vendor);
      alert(`${vendor.name} has been deleted successfully!`);
      // You would typically refresh the data here
    }
  };

  const handleAddNew = () => {
    setSelectedVendor(null);
    setFormMode('add');
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedVendor(null);
  };

  const renderForm = () => {
    const formProps = {
      onClose: handleCloseForm,
      mode: formMode as 'add' | 'edit',
    };

    switch (category) {
      case 'venues':
        return (
          <VenueForm
            {...formProps}
            venue={selectedVendor}
          />
        );
      case 'jewelry':
        return (
          <JewelryForm
            {...formProps}
            jewelry={selectedVendor}
          />
        );
      case 'photographers':
        return (
          <PhotographyForm
            {...formProps}
            photography={selectedVendor}
          />
        );
      case 'invitationCards':
        return (
          <InvitationForm
            {...formProps}
            invitation={selectedVendor}
          />
        );
      case 'makeupHairstylist':
        return (
          <MakeupHairstylistForm
            {...formProps}
            artist={selectedVendor}
          />
        );
      case 'eventPlanners':
        return (
          <EventPlannerForm
            {...formProps}
            planner={selectedVendor}
          />
        );
      case 'eventAnchors':
        return (
          <EventAnchorForm
            {...formProps}
            anchor={selectedVendor}
          />
        );
      case 'weddingAttire':
        return (
          <WeddingAttireForm
            {...formProps}
            vendor={selectedVendor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Vendor</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vendor.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vendor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vendor.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vendor.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleView(vendor)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors inline-flex items-center space-x-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleEdit(vendor)}
                      className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 transition-colors inline-flex items-center space-x-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(vendor)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors inline-flex items-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentVendors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm ? 'No vendors found matching your search.' : 'No vendors added yet.'}
            </div>
            {!searchTerm && (
              <button
                onClick={handleAddNew}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Your First Vendor
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredVendors.length)} of {filteredVendors.length} vendors
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      currentPage === page
                        ? 'bg-purple-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && renderForm()}
    </>
  );
};

export default VendorTable;