import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, Plus, Eye, Save, ArrowLeft, Camera, MapPin, Users, Building, DollarSign, ChevronDown, Search } from 'lucide-react';

interface VenueFormProps {
  onBack: () => void;
  venue?: any;
  mode: 'add' | 'edit';
}

interface EventArea {
  id: number;
  name: string;
  description: string;
  seating: string;
  floating: string;
  parking: string;
  size: string;
  images: File[];
}

const VenueForm: React.FC<VenueFormProps> = ({ onBack, venue, mode }) => {
  const [formData, setFormData] = useState({
    name: venue?.name || '',
    locations: venue?.locations || [],
    type: venue?.type || [],
    capacity: venue?.capacity || '',
    minPrice: venue?.minPrice || '',
    description: venue?.description || '',
    detailedDescription: venue?.detailedDescription || '',
    featured: venue?.featured || false,
    highlights: venue?.highlights || ['', '', '', ''],
    amenities: venue?.amenities || [],
    contactPerson: venue?.contactPerson || '',
    contactPhone: venue?.contactPhone || '',
    contactEmail: venue?.contactEmail || '',
    address: venue?.address || '',
    whatsappLink: venue?.whatsappLink || '',
    instagramLink: venue?.instagramLink || '',
    facebookLink: venue?.facebookLink || '',
    mapEmbed: venue?.mapEmbed || '',
  });

  const [eventAreas, setEventAreas] = useState<EventArea[]>([
    {
      id: 1,
      name: '',
      description: '',
      seating: '',
      floating: '',
      parking: '',
      size: '',
      images: [],
    },
  ]);

  const [mainImages, setMainImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewTab, setPreviewTab] = useState<'listing' | 'detailed'>('listing');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [venueTypeDropdownOpen, setVenueTypeDropdownOpen] = useState(false);
  const [venueTypeSearch, setVenueTypeSearch] = useState('');
  const [customVenueType, setCustomVenueType] = useState('');

  const mainInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const venueTypeRef = useRef<HTMLDivElement>(null);

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Chennai', 'Kolkata', 'Pune',
    'Hyderabad', 'Ahmedabad', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal'
  ];

  const venueTypeOptions = [
    'Hotel', 'Resort', 'Banquet Hall', 'Garden', 'Beach', 'Farmhouse',
    'Palace', 'Heritage Property', 'Club', 'Restaurant', 'Rooftop', 'Lawn'
  ];

  const capacityOptions = [
    '50-100 guests', '100-200 guests', '200-500 guests', '500+ guests'
  ];

  const amenityOptions = [
    'Air Conditioning', 'Parking', 'WiFi', 'Catering', 
    'Accommodation', 'Dance Floor', 'Pool', 'Garden'
  ];

  const filteredLocationOptions = locationOptions.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredVenueTypeOptions = venueTypeOptions.filter(type =>
    type.toLowerCase().includes(venueTypeSearch.toLowerCase())
  );

  const formatIndianPrice = (price: string) => {
    if (!price) return '';
    const number = parseInt(price.replace(/,/g, ''));
    if (isNaN(number)) return price;
    return number.toLocaleString('en-IN');
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

  const handleVenueTypeToggle = (type: string) => {
    setFormData(prev => {
      const currentTypes = prev.type;
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter(t => t !== type)
        : [...currentTypes, type];
      return { ...prev, type: newTypes };
    });
    if (errors.type) {
      setErrors(prev => ({ ...prev, type: '' }));
    }
  };

  const handleAddCustomVenueType = () => {
    if (customVenueType.trim() && !formData.type.includes(customVenueType.trim())) {
      setFormData(prev => ({
        ...prev,
        type: [...prev.type, customVenueType.trim()]
      }));
      setCustomVenueType('');
      if (errors.type) {
        setErrors(prev => ({ ...prev, type: '' }));
      }
    }
  };

  const handleRemoveVenueType = (typeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      type: prev.type.filter(type => type !== typeToRemove)
    }));
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData(prev => ({ ...prev, highlights: newHighlights }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const handleEventAreaChange = (id: number, field: string, value: string) => {
    setEventAreas(prev =>
      prev.map(area =>
        area.id === id ? { ...area, [field]: value } : area
      )
    );
  };

  const handleEventAreaImages = (id: number, files: FileList | null) => {
    if (files) {
      setEventAreas(prev =>
        prev.map(area =>
          area.id === id ? { ...area, images: Array.from(files) } : area
        )
      );
    }
  };

  const removeEventAreaImage = (areaId: number, imageIndex: number) => {
    setEventAreas(prev =>
      prev.map(area =>
        area.id === areaId
          ? { ...area, images: area.images.filter((_, i) => i !== imageIndex) }
          : area
      )
    );
  };

  const addEventArea = () => {
    const newId = Math.max(...eventAreas.map(area => area.id)) + 1;
    setEventAreas(prev => [
      ...prev,
      {
        id: newId,
        name: '',
        description: '',
        seating: '',
        floating: '',
        parking: '',
        size: '',
        images: [],
      },
    ]);
  };

  const removeEventArea = (id: number) => {
    if (eventAreas.length > 1) {
      setEventAreas(prev => prev.filter(area => area.id !== id));
    }
  };

  const handleMainImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMainImages(Array.from(e.target.files));
    }
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const removeMainImage = (index: number) => {
    setMainImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    if (thumbInputRef.current) {
      thumbInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Venue name is required';
    if (formData.locations.length === 0) newErrors.locations = 'At least one location is required';
    if (formData.type.length === 0) newErrors.type = 'At least one venue type is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    if (!formData.minPrice) newErrors.minPrice = 'Minimum price is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';
    if (!formData.detailedDescription.trim()) newErrors.detailedDescription = 'Detailed description is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    if (mainImages.length === 0 && mode === 'add') {
      newErrors.mainImages = 'At least one main image is required';
    }
    if (!thumbnail && mode === 'add') {
      newErrors.thumbnail = 'Thumbnail image is required';
    }

    const hasAreaName = eventAreas.some(area => area.name.trim());
    if (!hasAreaName) {
      newErrors.eventAreas = 'At least one event area with a name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Venue data:', { ...formData, eventAreas, mainImages, thumbnail });
      alert(`Venue ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      onBack();
    } catch (error) {
      alert('Failed to save venue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Venue deleted successfully!');
        onBack();
      } catch (error) {
        alert('Failed to delete venue. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationDropdownOpen(false);
      }
      if (venueTypeRef.current && !venueTypeRef.current.contains(e.target as Node)) {
        setVenueTypeDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl z-10">
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === 'add' ? 'Add New Venue' : 'Edit Venue'}
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
            <span>{isLoading ? 'Saving...' : 'Save Venue'}</span>
          </button>
          <button
            onClick={onBack}
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
            <Building className="h-5 w-5 mr-2 text-purple-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter venue name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Multi-Select Searchable Location Dropdown with Custom Entry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Locations * (Select multiple or add custom)
              </label>
              <div className="relative" ref={locationRef}>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity *
              </label>
              <select
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.capacity ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Capacity</option>
                {capacityOptions.map(capacity => (
                  <option key={capacity} value={capacity}>{capacity}</option>
                ))}
              </select>
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
            </div>

            {/* Multi-Select Venue Type Dropdown with Custom Entry */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Type * (Select multiple or add custom)
              </label>
              <div className="relative" ref={venueTypeRef}>
                <button
                  type="button"
                  onClick={() => setVenueTypeDropdownOpen(!venueTypeDropdownOpen)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <span className={formData.type.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.type.length > 0 
                      ? `${formData.type.length} type${formData.type.length > 1 ? 's' : ''} selected`
                      : 'Select Venue Types'
                    }
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${venueTypeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {venueTypeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          value={venueTypeSearch}
                          onChange={(e) => setVenueTypeSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Search venue types..."
                        />
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={customVenueType}
                          onChange={(e) => setCustomVenueType(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          placeholder="Enter custom venue type"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomVenueType();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomVenueType}
                          disabled={!customVenueType.trim()}
                          className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredVenueTypeOptions.map(type => (
                        <label
                          key={type}
                          className="flex items-center px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.type.includes(type)}
                            onChange={() => handleVenueTypeToggle(type)}
                            className="mr-3 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700">{type}</span>
                        </label>
                      ))}
                      {filteredVenueTypeOptions.length === 0 && venueTypeSearch && (
                        <div className="px-4 py-2 text-gray-500 text-sm">No venue types found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {formData.type.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.type.map(type => (
                    <span
                      key={type}
                      className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"
                    >
                      {type}
                      <button
                        type="button"
                        onClick={() => handleRemoveVenueType(type)}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Price (₹) *
              </label>
              <input
                type="text"
                name="minPrice"
                value={formData.minPrice}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setFormData(prev => ({ ...prev, minPrice: value }));
                }}
                onBlur={() => {
                  if (formData.minPrice) {
                    const formatted = parseInt(formData.minPrice).toLocaleString('en-IN');
                    setFormData(prev => ({ ...prev, minPrice: formatted }));
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.minPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter minimum price"
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
              placeholder="Enter a brief description of the venue"
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
              <span className="text-sm font-medium text-gray-700">Mark as Featured Venue</span>
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
              Main Images (Slider/Gallery) *
            </label>
            <div
              onClick={() => mainInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                errors.mainImages ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
              }`}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag & drop images here or click to browse</p>
              <p className="text-sm text-gray-500">Recommended: 5-10 high quality images (1200x800px)</p>
              <input
                ref={mainInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleMainImages}
                className="hidden"
              />
            </div>
            {errors.mainImages && <p className="text-red-500 text-sm mt-1">{errors.mainImages}</p>}
            
            {mainImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {mainImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeMainImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail Image *
            </label>
            <div
              onClick={() => thumbInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
              }`}
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to upload thumbnail</p>
              <input
                ref={thumbInputRef}
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
        </div>

        {/* Detailed Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Information</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About This Venue *
            </label>
            <textarea
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                errors.detailedDescription ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Provide detailed information about the venue"
            />
            {errors.detailedDescription && <p className="text-red-500 text-sm mt-1">{errors.detailedDescription}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
            <div className="space-y-3">
              {formData.highlights.map((highlight, index) => (
                <input
                  key={index}
                  type="text"
                  value={highlight}
                  onChange={(e) => handleHighlightChange(index, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Highlight ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Event Areas */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-600" />
              Event Areas
            </h3>
            <button
              onClick={addEventArea}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Event Area</span>
            </button>
          </div>
          {errors.eventAreas && <p className="text-red-500 text-sm mb-4">{errors.eventAreas}</p>}

          <div className="space-y-6">
            {eventAreas.map((area) => (
              <div key={area.id} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={area.name}
                    onChange={(e) => handleEventAreaChange(area.id, 'name', e.target.value)}
                    className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    placeholder="Area Name"
                  />
                  {eventAreas.length > 1 && (
                    <button
                      onClick={() => removeEventArea(area.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleEventAreaImages(area.id, e.target.files)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  {area.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {area.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Area ${area.id} Image ${index + 1}`}
                            className="w-full h-16 object-cover rounded"
                          />
                          <button
                            onClick={() => removeEventAreaImage(area.id, index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={area.description}
                    onChange={(e) => handleEventAreaChange(area.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Describe this event area"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity</label>
                    <input
                      type="text"
                      value={area.seating}
                      onChange={(e) => handleEventAreaChange(area.id, 'seating', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="500 guests"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floating Capacity</label>
                    <input
                      type="text"
                      value={area.floating}
                      onChange={(e) => handleEventAreaChange(area.id, 'floating', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="700 guests"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parking Capacity</label>
                    <input
                      type="text"
                      value={area.parking}
                      onChange={(e) => handleEventAreaChange(area.id, 'parking', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="150 cars"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area Size</label>
                    <input
                      type="text"
                      value={area.size}
                      onChange={(e) => handleEventAreaChange(area.id, 'size', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="8000 sq.ft."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenityOptions.map(amenity => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="mr-2 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact Information */}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed Code</label>
            <textarea
              name="mapEmbed"
              value={formData.mapEmbed}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Paste Google Maps embed code here"
            />
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

        {/* Preview Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Venue Preview</h3>
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
                    alt="Venue Thumbnail"
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    {formData.name || 'Venue Name'}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {formData.locations.length > 0 ? formData.locations.join(', ') : 'Locations'}
                    </p>
                    <p className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {formData.capacity || '100-200 guests'}
                    </p>
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ₹{formData.minPrice ? formData.minPrice.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '50,000'} onwards
                    </p>
                    <p className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {formData.type.length ? formData.type.join(', ') : 'No type selected'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
              {mainImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {mainImages.slice(0, 4).map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Venue Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  {formData.name || 'Venue Name'}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {formData.locations.length > 0 ? formData.locations.join(', ') : 'Locations'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {formData.capacity || '100-200 guests'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ₹{formData.minPrice ? formData.minPrice.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '50,000'} onwards
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-1" />
                    {formData.type.length ? formData.type.join(', ') : 'No type selected'}
                  </div>
                </div>
              </div>

              {formData.detailedDescription && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">About This Venue</h5>
                  <p className="text-gray-600 text-sm">{formData.detailedDescription}</p>
                </div>
              )}

              {formData.highlights.some(h => h) && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Highlights</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {formData.highlights.filter(h => h).map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.amenities.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Amenities</h5>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueForm;