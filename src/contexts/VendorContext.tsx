import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Vendor } from '../types/vendor';
import { mockVendors } from '../data/mockVendors';

interface VendorContextType {
  vendors: Record<string, Vendor[]>;
  addVendor: (category: string, vendor: FormData) => Promise<boolean>;
  updateVendor: (category: string, vendorId: number, vendor: FormData) => Promise<boolean>;
  deleteVendor: (category: string, vendorId: number) => Promise<boolean>;
  getVendorsByCategory: (category: string) => Promise<Vendor[]>;
  getVendorById: (category: string, id: number) => Promise<Vendor | null>;
  getTotalVendorCount: () => number;
  getCategoryCount: (category: string) => number;
  isLoading: boolean;
  error: string | null;
  refreshVendors: (category?: string) => Promise<void>;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const useVendors = () => {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendors must be used within a VendorProvider');
  }
  return context;
};

interface VendorProviderProps {
  children: ReactNode;
}

export const VendorProvider: React.FC<VendorProviderProps> = ({ children }) => {
  const [vendors, setVendors] = useState<Record<string, Vendor[]>>({
    venues: [],
    jewelry: [],
    photographers: [],
    invitationCards: [],
    makeupHairstylist: [],
    eventPlanners: [],
    eventAnchors: [],
    weddingAttire: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial mock data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Load mock data
        setVendors(mockVendors);
      } catch (error) {
        console.error('Failed to load initial vendor data:', error);
        setError('Failed to load vendor data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const refreshVendors = async (category?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (category) {
        // Refresh only one category with mock data
        const mockData = mockVendors[category as keyof typeof mockVendors] || [];
        setVendors(prev => ({
          ...prev,
          [category]: mockData
        }));
      } else {
        // Refresh all categories with mock data
        setVendors(mockVendors);
      }
    } catch (error) {
      console.error('Error refreshing vendors:', error);
      setError('Failed to refresh vendor data');
    } finally {
      setIsLoading(false);
    }
  };

  const addVendor = async (category: string, vendorData: FormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock vendor from form data
      const newVendor: Vendor = {
        id: Date.now(),
        name: vendorData.get('name') as string || 'New Vendor',
        contact: vendorData.get('contactEmail') as string || 'contact@example.com',
        location: vendorData.get('location') as string || 'Unknown',
        category: category
      };
      
      setVendors(prev => ({
        ...prev,
        [category]: [...prev[category], newVendor]
      }));
      
      return true;
    } catch (error) {
      console.error('Add vendor failed:', error);
      setError('Failed to add vendor. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVendor = async (category: string, vendorId: number, vendorData: FormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVendors(prev => ({
        ...prev,
        [category]: prev[category].map(vendor => 
          vendor.id === vendorId 
            ? {
                ...vendor,
                name: vendorData.get('name') as string || vendor.name,
                contact: vendorData.get('contactEmail') as string || vendor.contact,
                location: vendorData.get('location') as string || vendor.location,
              }
            : vendor
        )
      }));
      
      return true;
    } catch (error) {
      console.error('Update vendor failed:', error);
      setError('Failed to update vendor. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVendor = async (category: string, vendorId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setVendors(prev => ({
        ...prev,
        [category]: prev[category].filter(vendor => vendor.id !== vendorId)
      }));
      
      return true;
    } catch (error) {
      console.error('Delete vendor failed:', error);
      setError('Failed to delete vendor. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getVendorsByCategory = async (category: string): Promise<Vendor[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = mockVendors[category as keyof typeof mockVendors] || [];
      setVendors(prev => ({
        ...prev,
        [category]: data
      }));
      
      return data;
    } catch (error) {
      console.error('Get vendors failed:', error);
      setError('Failed to load vendors');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getVendorById = async (category: string, id: number): Promise<Vendor | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const categoryVendors = vendors[category] || mockVendors[category as keyof typeof mockVendors] || [];
      const vendor = categoryVendors.find(v => v.id === id) || null;
      
      return vendor;
    } catch (error) {
      console.error('Get vendor failed:', error);
      setError('Failed to load vendor');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalVendorCount = (): number => {
    return Object.values(vendors).reduce((total, categoryVendors) => total + categoryVendors.length, 0);
  };

  const getCategoryCount = (category: string): number => {
    return vendors[category]?.length || 0;
  };

  const value = {
    vendors,
    addVendor,
    updateVendor,
    deleteVendor,
    getVendorsByCategory,
    getVendorById,
    getTotalVendorCount,
    getCategoryCount,
    isLoading,
    error,
    refreshVendors
  };

  return (
    <VendorContext.Provider value={value}>
      {children}
    </VendorContext.Provider>
  );
};