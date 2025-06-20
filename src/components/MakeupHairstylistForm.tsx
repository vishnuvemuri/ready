// src/components/MakeupHairstylistForm.tsx

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, Plus, Eye, Save, ArrowLeft, Camera, MapPin, Users, Palette, DollarSign, ChevronDown, Search } from 'lucide-react';

interface MakeupHairstylistFormProps {
  onBack: () => void; // MODIFIED: Changed from onClose to onBack
  artist?: any;
  mode: 'add' | 'edit';
}

interface Service {
  id: number;
  name: string;
  price: string;
  duration: string;
  description: string;
}

const MakeupHairstylistForm: React.FC<MakeupHairstylistFormProps> = ({ onBack, artist, mode }) => { // MODIFIED: Changed from onClose to onBack
  const [formData, setFormData] = useState({
    name: artist?.name || '',
    locations: artist?.locations || [],
    specializations: artist?.specializations || [],
    type: artist?.type || '',
    minPrice: artist?.minPrice || '',
    description: artist?.description || '',
    detailedDescription: artist?.detailedDescription || '',
    featured: artist?.featured || false,
    contactPerson: artist?.contactPerson || '',
    contactPhone: artist?.contactPhone || '',
    contactEmail: artist?.contactEmail || '',
    studioAddress: artist?.studioAddress || '',
    whatsappLink: artist?.whatsappLink || '',
    instagramLink: artist?.instagramLink || '',
    facebookLink: artist?.facebookLink || '',
    packageName: artist?.packageName || '',
    packagePrice: artist?.packagePrice || '',
    packageDescription: artist?.packageDescription || '',
    yearsExperience: artist?.yearsExperience || '',
    happyClients: artist?.happyClients || '',
    premiumProducts: artist?.premiumProducts || '',
    completedLooks: artist?.completedLooks || '',
  });

  const [services, setServices] = useState<Service[]>([
    { id: 1, name: '', price: '', duration: '', description: '' },
  ]);

  const [inclusions, setInclusions] = useState<string[]>(['']);
  const [awards, setAwards] = useState<string[]>(['']);
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [previewTab, setPreviewTab] = useState<'listing' | 'detailed'>('listing');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dropdown states
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [specializationDropdownOpen, setSpecializationDropdownOpen] = useState(false);
  const [specializationSearch, setSpecializationSearch] = useState('');
  const [customSpecialization, setCustomSpecialization] = useState('');

  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Chennai', 'Kolkata', 'Pune',
    'Hyderabad', 'Ahmedabad', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal'
  ];

  const specializationOptions = [
    'Bridal Makeup', 'Groom Makeup', 'Engagement Makeup', 'Reception Makeup',
    'Traditional Makeup', 'HD Makeup', 'Airbrush Makeup', 'Hair Styling',
    'Bridal Hair', 'Party Hair', 'Hair Extensions', 'Hair Color',
    'Mehendi Design', 'Nail Art', 'Skincare', 'Grooming'
  ];

  const typeOptions = [
    { value: '', text: 'Select Type' },
    { value: 'Bridal', text: 'Bridal' },
    { value: 'Groom', text: 'Groom' },
    { value: 'Both', text: 'Both' },
  ];

  const filteredLocationOptions = locationOptions.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredSpecializationOptions = specializationOptions.filter(specialization =>
    specialization.toLowerCase().includes(specializationSearch.toLowerCase())
  );

  const formatIndianNumber = (value: string): string => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    if (!cleanValue || cleanValue === '.') return '';
    const parts = cleanValue.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];
    if (integerPart.length > 3) {
      const lastThree = integerPart.slice(-3);
      const remaining = integerPart.slice(0, -3);
      const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
      integerPart = formattedRemaining + ',' + lastThree;
    }
    return decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePricingChange = (field: string, value: string) => {
    if (value === '' || /^[a-zA-Z\s]+$/.test(value)) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      const formatted = formatIndianNumber(value);
      setFormData(prev => ({ ...prev, [field]: formatted }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationToggle = (location: string) => {
    setFormData(prev => {
      const currentLocations = prev.locations;
      const newLocations = currentLocations.includes(location)
        ? currentLocations.filter(l => l !== location)
        : [...currentLocations, location];
      return { ...prev, locations: newLocations };
    });
    if (errors.locations) {
      setErrors(prev => ({ ...prev, locations: '' }));
    }
  };

  const handleAddCustomLocation = () => {
    if (customLocation.trim() && !formData.locations.includes(customLocation.trim())) {
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, customLocation.trim()]
      }));
      setCustomLocation('');
      if (errors.locations) {
        setErrors(prev => ({ ...prev, locations: '' }));
      }
    }
  };

  const handleRemoveLocation = (locationToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter(location => location !== locationToRemove)
    }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => {
      const currentSpecializations = prev.specializations;
      const newSpecializations = currentSpecializations.includes(specialization)
        ? currentSpecializations.filter(s => s !== specialization)
        : [...currentSpecializations, specialization];
      return { ...prev, specializations: newSpecializations };
    });
    if (errors.specializations) {
      setErrors(prev => ({ ...prev, specializations: '' }));
    }
  };

  const handleAddCustomSpecialization = () => {
    if (customSpecialization.trim() && !formData.specializations.includes(customSpecialization.trim())) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, customSpecialization.trim()]
      }));
      setCustomSpecialization('');
      if (errors.specializations) {
        setErrors(prev => ({ ...prev, specializations: '' }));
      }
    }
  };

  const handleRemoveSpecialization = (specializationToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(specialization => specialization !== specializationToRemove)
    }));
  };

  const handleServiceChange = (id: number, field: string, value: string) => {
    if (field === 'price') {
      let formattedValue = value;
      if (value !== '' && !/^[a-zA-Z\s]+$/.test(value)) {
        formattedValue = formatIndianNumber(value);
      }
      setServices(prev =>
        prev.map(service =>
          service.id === id ? { ...service, [field]: formattedValue } : service
        )
      );
    } else {
      setServices(prev =>
        prev.map(service =>
          service.id === id ? { ...service, [field]: value } : service
        )
      );
    }
  };

  const addService = () => {
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    setServices(prev => [
      ...prev,
      { id: newId, name: '', price: '', duration: '', description: '' },
    ]);
  };

  const removeService = (id: number) => {
    if (services.length > 1) {
      setServices(prev => prev.filter(service => service.id !== id));
    }
  };

  const handleInclusionChange = (index: number, value: string) => {
    const newInclusions = [...inclusions];
    newInclusions[index] = value;
    setInclusions(newInclusions);
  };

  const addInclusion = () => {
    setInclusions(prev => [...prev, '']);
  };

  const removeInclusion = (index: number) => {
    if (inclusions.length > 1) {
      setInclusions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleAwardChange = (index: number, value: string) => {
    const newAwards = [...awards];
    newAwards[index] = value;
    setAwards(newAwards);
  };

  const addAward = () => {
    setAwards(prev => [...prev, '']);
  };

  const removeAward = (index: number) => {
    if (awards.length > 1) {
      setAwards(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handlePortfolioImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPortfolioImages(Array.from(e.target.files));
    }
  };

  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const removePortfolioImage = (index: number) => {
    setPortfolioImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    if (profileInputRef.current) {
      profileInputRef.current.value = '';
    }
  };

  const removeVideo = () => {
    setVideo(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Artist name is required';
    if (formData.locations.length === 0) newErrors.locations = 'At least one location is required';
    if (formData.specializations.length === 0) newErrors.specializations = 'At least one specialization is required';
    if (!formData.type) newErrors.type = 'Artist type is required';
    if (!formData.minPrice.trim()) newErrors.minPrice = 'Starting price is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';
    if (!formData.detailedDescription.trim()) newErrors.detailedDescription = 'Detailed description is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';

    const validServices = services.filter(s => s.name.trim() && s.price.trim());
    if (validServices.length === 0) {
      newErrors.services = 'At least one service with name and price is required';
    }

    if (portfolioImages.length === 0 && mode === 'add') {
      newErrors.portfolioImages = 'At least one portfolio image is required';
    }
    if (!profileImage && mode === 'add') {
      newErrors.profileImage = 'Profile image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Artist data:', {
        ...formData,
        services: services.filter(s => s.name.trim()),
        inclusions: inclusions.filter(inc => inc.trim()),
        awards: awards.filter(award => award.trim()),
        portfolioImages,
        profileImage,
        video
      });
      alert(`Artist ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      onBack(); // MODIFIED: Changed from onClose to onBack
    } catch (error) {
      alert('Failed to save artist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Artist deleted successfully!');
        onBack(); // MODIFIED: Changed from onClose to onBack
      } catch (error) {
        alert('Failed to delete artist. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('[data-dropdown="location"]')) {
        setLocationDropdownOpen(false);
        setLocationSearch('');
      }
      if (!target.closest('[data-dropdown="specialization"]')) {
        setSpecializationDropdownOpen(false);
        setSpecializationSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // MODIFIED: Removed the outer modal div. The component now returns the form content directly.
  return (
    <div className="bg-white rounded-2xl shadow-xl w-full">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'add' ? 'Add New Makeup & Hairstylist' : 'Edit Makeup & Hairstylist'}
          </h2>
          <div className="flex items-center space-x-3">
            {mode === 'edit' && (
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}
            <button
              onClick={() => setPreviewTab(previewTab === 'listing' ? 'detailed' : 'listing')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Artist'}</span>
            </button>
            <button
              onClick={onBack} // MODIFIED: Changed from onClose to onBack
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2 text-purple-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artist Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter artist name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Multi-Select Searchable Location Dropdown with Custom Entry */}
              <div data-dropdown="location">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locations * (Select multiple or add custom)
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
                      errors.locations ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <span className={formData.locations.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.locations.length > 0 
                        ? `${formData.locations.length} location${formData.locations.length > 1 ? 's' : ''} selected`
                        : 'Select Locations'
                      }
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {locationDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="p-3 border-b border-gray-200">
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Search locations..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={customLocation}
                            onChange={(e) => setCustomLocation(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            placeholder="Enter custom location"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomLocation();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomLocation}
                            disabled={!customLocation.trim()}
                            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredLocationOptions.map(location => (
                          <label
                            key={location}
                            className="flex items-center px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.locations.includes(location)}
                              onChange={() => handleLocationToggle(location)}
                              className="mr-3 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-gray-700">{location}</span>
                          </label>
                        ))}
                        {filteredLocationOptions.length === 0 && locationSearch && (
                          <div className="px-4 py-2 text-gray-500 text-sm">No locations found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {formData.locations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.locations.map(location => (
                      <span
                        key={location}
                        className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {location}
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(location)}
                          className="ml-1 text-purple-600 hover:text-purple-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.locations && <p className="text-red-500 text-sm mt-1">{errors.locations}</p>}
              </div>

              {/* Multi-Select Searchable Specialization Dropdown with Custom Entry */}
              <div data-dropdown="specialization">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations * (Select multiple or add custom)
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSpecializationDropdownOpen(!specializationDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
                      errors.specializations ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <span className={formData.specializations.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.specializations.length > 0 
                        ? `${formData.specializations.length} specialization${formData.specializations.length > 1 ? 's' : ''} selected`
                        : 'Select Specializations'
                      }
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${specializationDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {specializationDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="p-3 border-b border-gray-200">
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            value={specializationSearch}
                            onChange={(e) => setSpecializationSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Search specializations..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={customSpecialization}
                            onChange={(e) => setCustomSpecialization(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            placeholder="Enter custom specialization"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomSpecialization();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomSpecialization}
                            disabled={!customSpecialization.trim()}
                            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredSpecializationOptions.map(specialization => (
                          <label
                            key={specialization}
                            className="flex items-center px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.specializations.includes(specialization)}
                              onChange={() => handleSpecializationToggle(specialization)}
                              className="mr-3 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-gray-700">{specialization}</span>
                          </label>
                        ))}
                        {filteredSpecializationOptions.length === 0 && specializationSearch && (
                          <div className="px-4 py-2 text-gray-500 text-sm">No specializations found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {formData.specializations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.specializations.map(specialization => (
                      <span
                        key={specialization}
                        className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {specialization}
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecialization(specialization)}
                          className="ml-1 text-purple-600 hover:text-purple-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.specializations && <p className="text-red-500 text-sm mt-1">{errors.specializations}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artist Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.text}</option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price (₹) *
                </label>
                <input
                  type="text"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={(e) => handlePricingChange('minPrice', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.minPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 15,000 or Price on Request"
                />
                {errors.minPrice && <p className="text-red-500 text-sm mt-1">{errors.minPrice}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter a brief description of the artist"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Featured Artist</span>
              </label>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-purple-600" />
              Media
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Images (Gallery) *
              </label>
              <div
                onClick={() => portfolioInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  errors.portfolioImages ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag & drop images here or click to browse</p>
                <p className="text-sm text-gray-500">Recommended: 5-10 high quality images (1200x800px)</p>
                <input
                  ref={portfolioInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePortfolioImages}
                  className="hidden"
                />
              </div>
              {errors.portfolioImages && <p className="text-red-500 text-sm mt-1">{errors.portfolioImages}</p>}
              
              {portfolioImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {portfolioImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePortfolioImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image *
              </label>
              <div
                onClick={() => profileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  errors.profileImage ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload profile image</p>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImage}
                  className="hidden"
                />
              </div>
              {errors.profileImage && <p className="text-red-500 text-sm mt-1">{errors.profileImage}</p>}
              
              {profileImage && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile Preview"
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeProfileImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Video
              </label>
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Upload portfolio video (MP4 format)</p>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideo}
                  className="hidden"
                />
              </div>
              
              {video && (
                <div className="mt-4">
                  <video controls className="w-full max-w-md rounded-lg">
                    <source src={URL.createObjectURL(video)} type={video.type} />
                    Your browser does not support the video tag.
                  </video>
                  <button
                    onClick={removeVideo}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Remove Video
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Information</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About This Artist *
              </label>
              <textarea
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.detailedDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Provide detailed information about the artist"
              />
              {errors.detailedDescription && <p className="text-red-500 text-sm mt-1">{errors.detailedDescription}</p>}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
              Services & Packages
            </h3>
            {errors.services && <p className="text-red-500 text-sm mb-4">{errors.services}</p>}
            
            <div className="space-y-6">
              {services.map((service, index) => (
                <div key={service.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-800">Service {index + 1}</h4>
                    {services.length > 1 && (
                      <button
                        onClick={() => removeService(service.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Bridal Makeup"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                      <input
                        type="text"
                        value={service.price}
                        onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., 15,000 or Price on Request"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={service.duration}
                        onChange={(e) => handleServiceChange(service.id, 'duration', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="2-3 hours"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={service.description}
                      onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Service description"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addService}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Service</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                <input
                  type="text"
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Bridal Package"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Price (₹)</label>
                <input
                  type="text"
                  name="packagePrice"
                  value={formData.packagePrice}
                  onChange={(e) => handlePricingChange('packagePrice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 25,000 or Price on Request"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Description</label>
              <textarea
                name="packageDescription"
                value={formData.packageDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Describe what's included in this package"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Inclusions</label>
              <div className="space-y-3">
                {inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) => handleInclusionChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Package inclusion"
                    />
                    {inclusions.length > 1 && (
                      <button
                        onClick={() => removeInclusion(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addInclusion}
                className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Inclusion</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Stats & Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years Experience</label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Happy Clients</label>
                <input
                  type="number"
                  name="happyClients"
                  value={formData.happyClients}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Premium Products</label>
                <input
                  type="number"
                  name="premiumProducts"
                  value={formData.premiumProducts}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Completed Looks</label>
                <input
                  type="number"
                  name="completedLooks"
                  value={formData.completedLooks}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="1000"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Awards & Recognitions</label>
              <div className="space-y-3">
                {awards.map((award, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={award}
                      onChange={(e) => handleAwardChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Award or recognition"
                    />
                    {awards.length > 1 && (
                      <button
                        onClick={() => removeAward(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addAward}
                className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Award</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter contact person name"
                />
                {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Studio Address</label>
                <input
                  type="text"
                  name="studioAddress"
                  value={formData.studioAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter studio address"
                />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Social Media Links</h4>
              <input
                type="url"
                name="whatsappLink"
                value={formData.whatsappLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="WhatsApp Link"
              />
              <input
                type="url"
                name="instagramLink"
                value={formData.instagramLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Instagram Link"
              />
              <input
                type="url"
                name="facebookLink"
                value={formData.facebookLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Facebook Link"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Artist Preview</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPreviewTab('listing')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    previewTab === 'listing'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Listing View
                </button>
                <button
                  onClick={() => setPreviewTab('detailed')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    previewTab === 'detailed'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Detailed View
                </button>
              </div>
            </div>
            {previewTab === 'listing' ? (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex space-x-4">
                  {profileImage && (
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Artist Profile"
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {formData.name || 'Artist Name'}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {formData.locations.length > 0 ? formData.locations.join(', ') : 'Locations'}
                      </p>
                      <p className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {formData.specializations.length > 0 ? formData.specializations.join(', ') : 'Specializations'}
                      </p>
                      <p className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ₹{formData.minPrice || 'Price on Request'} onwards
                      </p>
                      <p className="flex items-center">
                        <Palette className="h-4 w-4 mr-1" />
                        {formData.type || 'Type'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    {formData.name || 'Artist Name'}
                  </h4>
                  <p className="text-gray-600">{formData.detailedDescription || 'No detailed description provided'}</p>
                </div>
                {services.filter(s => s.name.trim()).length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Services Offered</h5>
                    <div className="space-y-2">
                      {services.filter(s => s.name.trim()).map((service) => (
                        <div key={service.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <h6 className="font-medium text-gray-800">{service.name}</h6>
                            <span className="text-purple-600 font-semibold">₹{service.price || 'Price on Request'}</span>
                          </div>
                          {service.duration && <p className="text-sm text-gray-600">Duration: {service.duration}</p>}
                          {service.description && <p className="text-sm text-gray-600 mt-1">{service.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {portfolioImages.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Portfolio</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {portfolioImages.slice(0, 4).map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{formData.yearsExperience || '0'}+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{formData.happyClients || '0'}+</div>
                    <div className="text-sm text-gray-600">Happy Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{formData.premiumProducts || '0'}+</div>
                    <div className="text-sm text-gray-600">Premium Products</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{formData.completedLooks || '0'}+</div>
                    <div className="text-sm text-gray-600">Completed Looks</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        
    </div>
  );
};

export default MakeupHairstylistForm;
