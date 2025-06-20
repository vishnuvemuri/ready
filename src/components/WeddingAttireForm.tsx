// src/components/WeddingAttireForm.tsx

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, Plus, Eye, Save, ArrowLeft, Camera, MapPin, Users, Shirt, DollarSign, ChevronDown, Search } from 'lucide-react';

// MODIFIED: Props interface updated to use `onBack` instead of `onClose`
interface WeddingAttireFormProps {
  onBack: () => void;
  vendor?: any; // For editing existing vendor
  mode: 'add' | 'edit';
}

interface Collection {
  id: number;
  title: string;
  image: File | null;
  preview: string;
}

interface Arrival {
  id: number;
  title: string;
  image: File | null;
  preview: string;
}

interface Location {
  id: number;
  city: string;
  address: string;
}

// MODIFIED: Component signature updated to use `onBack` prop
const WeddingAttireForm: React.FC<WeddingAttireFormProps> = ({ onBack, vendor, mode }) => {
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    cities: vendor?.cities || [],
    category: vendor?.category || '',
    shortDescription: vendor?.shortDescription || '',
    longDescription: vendor?.longDescription || '',
    featured: vendor?.featured || false,
    contactPhone: vendor?.contactPhone || '',
    contactEmail: vendor?.contactEmail || '',
    website: vendor?.website || '',
    appointmentUrl: vendor?.appointmentUrl || '',
    whatsappLink: vendor?.whatsappLink || '',
    instagramLink: vendor?.instagramLink || '',
    emailLink: vendor?.emailLink || '',
  });

  const [collections, setCollections] = useState<Collection[]>([
    { id: 1, title: '', image: null, preview: '' },
  ]);

  const [arrivals, setArrivals] = useState<Arrival[]>([
    { id: 1, title: '', image: null, preview: '' },
  ]);

  const [locations, setLocations] = useState<Location[]>([
    { id: 1, city: '', address: '' },
  ]);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [heroImages, setHeroImages] = useState<File[]>([]);
  const [previewTab, setPreviewTab] = useState<'listing' | 'detailed'>('listing');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dropdown states
  const [citiesDropdownOpen, setCitiesDropdownOpen] = useState(false);
  const [citiesSearch, setCitiesSearch] = useState('');

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const citiesDropdownRef = useRef<HTMLDivElement>(null);

  const cityOptions = [
    'Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
    'Jaipur', 'Ahmedabad', 'Pune', 'Surat', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Bhopal', 'Other Metro Cities'
  ];

  const categoryOptions = [
    'All Attire', 'Bridal Collection', 'Groom Collection'
  ];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (citiesDropdownRef.current && !citiesDropdownRef.current.contains(event.target as Node)) {
        setCitiesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Filter options based on search
  const filteredCityOptions = cityOptions.filter(city =>
    city.toLowerCase().includes(citiesSearch.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCityToggle = (city: string) => {
    setFormData(prev => {
      const currentCities = prev.cities;
      const newCities = currentCities.includes(city)
        ? currentCities.filter(c => c !== city)
        : [...currentCities, city];
      return { ...prev, cities: newCities };
    });
    if (errors.cities) {
      setErrors(prev => ({ ...prev, cities: '' }));
    }
  };

  const handleAddCustomCity = () => {
    const newCity = citiesSearch.trim();
    if (newCity && !formData.cities.includes(newCity)) {
        setFormData(prev => ({
            ...prev,
            cities: [...prev.cities, newCity]
        }));
        if (errors.cities) {
            setErrors(prev => ({ ...prev, cities: '' }));
        }
        setCitiesSearch(''); // Clear search input after adding
    }
  };

  const handleCollectionChange = (id: number, field: string, value: string) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === id ? { ...collection, [field]: value } : collection
      )
    );
  };

  const handleCollectionImage = (id: number, file: File | null) => {
    if (file) {
      setCollections(prev =>
        prev.map(collection =>
          collection.id === id
            ? { ...collection, image: file, preview: URL.createObjectURL(file) }
            : collection
        )
      );
    }
  };

  const addCollection = () => {
    if (collections.length < 3) {
      const newId = collections.length > 0 ? Math.max(...collections.map(c => c.id)) + 1 : 1;
      setCollections(prev => [
        ...prev,
        { id: newId, title: '', image: null, preview: '' },
      ]);
    }
  };

  const removeCollection = (id: number) => {
    if (collections.length > 1) {
      setCollections(prev => prev.filter(collection => collection.id !== id));
    }
  };

  const handleArrivalChange = (id: number, field: string, value: string) => {
    setArrivals(prev =>
      prev.map(arrival =>
        arrival.id === id ? { ...arrival, [field]: value } : arrival
      )
    );
  };

  const handleArrivalImage = (id: number, file: File | null) => {
    if (file) {
      setArrivals(prev =>
        prev.map(arrival =>
          arrival.id === id
            ? { ...arrival, image: file, preview: URL.createObjectURL(file) }
            : arrival
        )
      );
    }
  };

  const addArrival = () => {
    if (arrivals.length < 3) {
        const newId = arrivals.length > 0 ? Math.max(...arrivals.map(a => a.id)) + 1 : 1;
      setArrivals(prev => [
        ...prev,
        { id: newId, title: '', image: null, preview: '' },
      ]);
    }
  };

  const removeArrival = (id: number) => {
    if (arrivals.length > 1) {
      setArrivals(prev => prev.filter(arrival => arrival.id !== id));
    }
  };

  const handleLocationChange = (id: number, field: string, value: string) => {
    setLocations(prev =>
      prev.map(location =>
        location.id === id ? { ...location, [field]: value } : location
      )
    );
  };

  const addLocation = () => {
    const newId = locations.length > 0 ? Math.max(...locations.map(l => l.id)) + 1 : 1;
    setLocations(prev => [
      ...prev,
      { id: newId, city: '', address: '' },
    ]);
  };

  const removeLocation = (id: number) => {
    if (locations.length > 1) {
      setLocations(prev => prev.filter(location => location.id !== id));
    }
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleHeroImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setHeroImages(Array.from(e.target.files).slice(0, 3));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  const removeLogo = () => {
    setLogo(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const removeHeroImage = (index: number) => {
    setHeroImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeCollectionImage = (id: number) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === id
          ? { ...collection, image: null, preview: '' }
          : collection
      )
    );
  };

  const removeArrivalImage = (id: number) => {
    setArrivals(prev =>
      prev.map(arrival =>
        arrival.id === id
          ? { ...arrival, image: null, preview: '' }
          : arrival
      )
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Vendor name is required';
    if (formData.cities.length === 0) newErrors.cities = 'At least one city is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.longDescription.trim()) newErrors.longDescription = 'About us description is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';

    if (thumbnail === null && mode === 'add') {
      newErrors.thumbnail = 'Thumbnail image is required';
    }
    if (logo === null && mode === 'add') {
      newErrors.logo = 'Logo is required';
    }
    if (heroImages.length === 0 && mode === 'add') {
      newErrors.heroImages = 'At least one hero image is required';
    }

    const validCollections = collections.filter(c => c.title.trim());
    if (validCollections.length === 0) {
      newErrors.collections = 'At least one collection with title is required';
    }

    const validArrivals = arrivals.filter(a => a.title.trim());
    if (validArrivals.length === 0) {
      newErrors.arrivals = 'At least one arrival with title is required';
    }

    const validLocations = locations.filter(l => l.city.trim() && l.address.trim());
    if (validLocations.length === 0) {
      newErrors.locations = 'At least one complete location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Wedding Attire Vendor data:', {
        ...formData,
        collections: collections.filter(c => c.title.trim()),
        arrivals: arrivals.filter(a => a.title.trim()),
        locations: locations.filter(l => l.city.trim() && l.address.trim()),
        thumbnail,
        logo,
        heroImages
      });

      alert(`Wedding Attire Vendor ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      onBack(); // MODIFIED: Call onBack on successful submission
    } catch (error) {
      alert('Failed to save vendor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Vendor deleted successfully!');
        onBack(); // MODIFIED: Call onBack on successful deletion
      } catch (error) {
        alert('Failed to delete vendor. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // MODIFIED: Removed the modal wrapper (`fixed inset-0`) and the dialog container.
  // The component now returns a standard div to be rendered inline on the page.
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl z-20">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'add' ? 'Add New Wedding Attire Vendor' : 'Edit Wedding Attire Vendor'}
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
              <span>{isLoading ? 'Saving...' : 'Save Vendor'}</span>
            </button>
            <button
              onClick={onBack} // MODIFIED: Use the onBack prop
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
              <Shirt className="h-5 w-5 mr-2 text-purple-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter vendor name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* MODIFIED: Multi-Select Searchable Cities Dropdown with Custom Input */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cities * (Select or add multiple)
                  </label>
                  <div className="relative" ref={citiesDropdownRef}>
                      <button
                          type="button"
                          onClick={() => setCitiesDropdownOpen(!citiesDropdownOpen)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
                              errors.cities ? 'border-red-500' : 'border-gray-300'
                          }`}
                      >
                          <span className={formData.cities.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                              {formData.cities.length > 0
                                  ? `${formData.cities.length} cities selected`
                                  : 'Select or add cities'
                              }
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${citiesDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {citiesDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                              <div className="p-2 border-b border-gray-200">
                                  <div className="relative">
                                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                      <input
                                          type="text"
                                          value={citiesSearch}
                                          onChange={(e) => setCitiesSearch(e.target.value)}
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  handleAddCustomCity();
                                              }
                                          }}
                                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                          placeholder="Search or add a new city..."
                                      />
                                  </div>
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                  {filteredCityOptions.map(city => (
                                      <label
                                          key={city}
                                          className="flex items-center px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
                                      >
                                          <input
                                              type="checkbox"
                                              checked={formData.cities.includes(city)}
                                              onChange={() => handleCityToggle(city)}
                                              className="mr-3 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                          />
                                          <span className="text-gray-700">{city}</span>
                                      </label>
                                  ))}
                                  {citiesSearch.trim() && !formData.cities.some(c => c.toLowerCase() === citiesSearch.trim().toLowerCase()) && (
                                    <div
                                        onClick={handleAddCustomCity}
                                        className="flex items-center px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors text-purple-600"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        <span>Add "{citiesSearch.trim()}"</span>
                                    </div>
                                  )}
                                  {filteredCityOptions.length === 0 && !citiesSearch.trim() && (
                                    <p className="px-4 py-2 text-gray-500 text-sm">No predefined cities match.</p>
                                  )}
                              </div>
                          </div>
                      )}
                  </div>
                  {formData.cities.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                          {formData.cities.map(city => (
                              <span
                                  key={city}
                                  className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center"
                              >
                                  {city}
                                  <button
                                      type="button"
                                      onClick={() => handleCityToggle(city)}
                                      className="ml-1.5 text-purple-600 hover:text-purple-800"
                                  >
                                      <X className="h-3 w-3" />
                                  </button>
                              </span>
                          ))}
                      </div>
                  )}
                  {errors.cities && <p className="text-red-500 text-sm mt-1">{errors.cities}</p>}
              </div>
              {/* END MODIFICATION */}


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description that appears on listing cards"
              />
              {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>}
            </div>

            {/* Thumbnail Image */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image *
              </label>
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload thumbnail</p>
                <p className="text-sm text-gray-500">This image will appear on vendor cards</p>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnail}
                  className="hidden"
                />
              </div>
              {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
              
              {thumbnail && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="Thumbnail Preview"
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeThumbnail}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Featured Vendor</span>
              </label>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Detailed Information
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Us *
              </label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.longDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Detailed information about your company"
              />
              {errors.longDescription && <p className="text-red-500 text-sm mt-1">{errors.longDescription}</p>}
            </div>

            {/* Vendor Logo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Logo *
              </label>
              <div
                onClick={() => logoInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  errors.logo ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload logo</p>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogo}
                  className="hidden"
                />
              </div>
              {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
              
              {logo && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={URL.createObjectURL(logo)}
                    alt="Logo Preview"
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Hero Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Images (Slider) *
              </label>
              <div
                onClick={() => heroInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  errors.heroImages ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag & drop images here or click to browse</p>
                <p className="text-sm text-gray-500">Upload up to 3 high-quality images for the slider (1200x800px recommended)</p>
                <input
                  ref={heroInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleHeroImages}
                  className="hidden"
                />
              </div>
              {errors.heroImages && <p className="text-red-500 text-sm mt-1">{errors.heroImages}</p>}
              
              {heroImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {heroImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Hero ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeHeroImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Collection Images */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-purple-600" />
              Collection Images
            </h3>
            {errors.collections && <p className="text-red-500 text-sm mb-4">{errors.collections}</p>}
            
            <div className="space-y-6">
              {collections.map((collection) => (
                <div key={collection.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={collection.title}
                      onChange={(e) => handleCollectionChange(collection.id, 'title', e.target.value)}
                      className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0 flex-1"
                      placeholder="Collection Title"
                    />
                    {collections.length > 1 && (
                      <button
                        onClick={() => removeCollection(collection.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Collection Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCollectionImage(collection.id, e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                    {collection.preview && (
                      <div className="mt-2 relative inline-block">
                        <img
                          src={collection.preview}
                          alt={`Collection ${collection.title}`}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeCollectionImage(collection.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addCollection}
              disabled={collections.length >= 3}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Collection (Max 3)</span>
            </button>
          </div>

          {/* New Arrival Images */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              New Arrival Images
            </h3>
            {errors.arrivals && <p className="text-red-500 text-sm mb-4">{errors.arrivals}</p>}
            
            <div className="space-y-6">
              {arrivals.map((arrival) => (
                <div key={arrival.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={arrival.title}
                      onChange={(e) => handleArrivalChange(arrival.id, 'title', e.target.value)}
                      className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0 flex-1"
                      placeholder="Arrival Title"
                    />
                    {arrivals.length > 1 && (
                      <button
                        onClick={() => removeArrival(arrival.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleArrivalImage(arrival.id, e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                    {arrival.preview && (
                      <div className="mt-2 relative inline-block">
                        <img
                          src={arrival.preview}
                          alt={`Arrival ${arrival.title}`}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeArrivalImage(arrival.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addArrival}
              disabled={arrivals.length >= 3}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Arrival (Max 3)</span>
            </button>
          </div>

          {/* Store Locations */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-600" />
              Store Locations
            </h3>
            {errors.locations && <p className="text-red-500 text-sm mb-4">{errors.locations}</p>}
            
            <div className="space-y-4">
              {locations.map((location) => (
                <div key={location.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={location.city}
                          onChange={(e) => handleLocationChange(location.id, 'city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter city name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          value={location.address}
                          onChange={(e) => handleLocationChange(location.id, 'address', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="123 Fashion Street"
                        />
                      </div>
                    </div>
                    {locations.length > 1 && (
                      <button
                        onClick={() => removeLocation(location.id)}
                        className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addLocation}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Location</span>
            </button>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Book Appointment URL</label>
                <input
                  type="url"
                  name="appointmentUrl"
                  value={formData.appointmentUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://booking.yourwebsite.com"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Social Media Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="url"
                    name="whatsappLink"
                    value={formData.whatsappLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="WhatsApp Link"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input
                    type="url"
                    name="instagramLink"
                    value={formData.instagramLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Instagram Link"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="url"
                    name="emailLink"
                    value={formData.emailLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Email Link"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Vendor Preview</h3>
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
                  {thumbnail && (
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Vendor Thumbnail"
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {formData.name || 'Vendor Name'}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {formData.cities.length > 0 ? formData.cities.join(', ') : 'Cities'}
                      </p>
                      <p className="flex items-center">
                        <Shirt className="h-4 w-4 mr-1" />
                        {formData.category || 'Category'}
                      </p>
                    </div>
                    <p className="text-gray-600 mt-2">
                      {formData.shortDescription || 'No description provided'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                {heroImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {heroImages.slice(0, 3).map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Hero ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    {formData.name || 'Vendor Name'}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {formData.cities.length > 0 ? formData.cities.join(', ') : 'Cities'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Shirt className="h-4 w-4 mr-1" />
                      {formData.category || 'Category'}
                    </div>
                  </div>
                </div>

                {formData.longDescription && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">About Us</h5>
                    <p className="text-gray-600 text-sm">{formData.longDescription}</p>
                  </div>
                )}

                {collections.filter(c => c.title.trim()).length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Our Collections</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {collections.filter(c => c.title.trim()).map((collection) => (
                        <div key={collection.id} className="text-center">
                          {collection.preview && (
                            <img
                              src={collection.preview}
                              alt={collection.title}
                              className="w-full h-24 object-cover rounded-lg mb-2"
                            />
                          )}
                          <p className="text-sm font-medium">{collection.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {arrivals.filter(a => a.title.trim()).length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">New Arrivals</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {arrivals.filter(a => a.title.trim()).map((arrival) => (
                        <div key={arrival.id} className="text-center">
                          {arrival.preview && (
                            <img
                              src={arrival.preview}
                              alt={arrival.title}
                              className="w-full h-24 object-cover rounded-lg mb-2"
                            />
                          )}
                          <p className="text-sm font-medium">{arrival.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {locations.filter(l => l.city.trim() && l.address.trim()).length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Store Locations</h5>
                    <div className="space-y-2">
                      {locations.filter(l => l.city.trim() && l.address.trim()).map((location) => (
                        <div key={location.id} className="text-sm">
                          <p className="font-medium">{location.city}</p>
                          <p className="text-gray-600">{location.address}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
       
    </div>
  );
};

export default WeddingAttireForm;
