import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, Plus, Eye, Save, ArrowLeft, Camera, MapPin, Users, Building, DollarSign, ChevronDown, Search } from 'lucide-react';

interface VenueFormProps {
  onClose: () => void;
  venue?: any; // For editing existing venue
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

const VenueForm: React.FC<VenueFormProps> = ({ onClose, venue, mode }) => {
  const [formData, setFormData] = useState({
    name: venue?.name || '',
    location: venue?.location || '',
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

  // Dropdown states
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [venueTypeDropdownOpen, setVenueTypeDropdownOpen] = useState(false);
  const [venueTypeSearch, setVenueTypeSearch] = useState('');

  const mainInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

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

  // Filter options based on search
  const filteredLocationOptions = locationOptions.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredVenueTypeOptions = venueTypeOptions.filter(type =>
    type.toLowerCase().includes(venueTypeSearch.toLowerCase())
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

  const handleLocationSelect = (location: string) => {
    setFormData(prev => ({ ...prev, location }));
    setLocationDropdownOpen(false);
    setLocationSearch('');
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
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
    if (!formData.location) newErrors.location = 'Location is required';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Venue data:', {
        ...formData,
        eventAreas,
        mainImages,
        thumbnail
      });
      
      alert(`Venue ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      onClose();
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Venue deleted successfully!');
        onClose();
      } catch (error) {
        alert('Failed to delete venue. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
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
              onClick={onClose}
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

              {/* Single Select Searchable Location Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <span className={formData.location ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.location || 'Select Location'}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {locationDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Search locations..."
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredLocationOptions.map(location => (
                          <button
                            key={location}
                            type="button"
                            onClick={() => handleLocationSelect(location)}
                            className={`w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors ${
                              formData.location === location ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                            }`}
                          >
                            {location}
                          </button>
                        ))}
                        {filteredLocationOptions.length === 0 && (
                          <div className="px-4 py-2 text-gray-500 text-sm">No locations found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
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

              {/* Multi-Select Venue Type Dropdown */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Type * (Select multiple)
                </label>
                <div className="relative">
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
                      <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            value={venueTypeSearch}
                            onChange={(e) => setVenueTypeSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Search venue types..."
                          />
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
                        {filteredVenueTypeOptions.length === 0 && (
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
                          onClick={() => handleVenueTypeToggle(type)}
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
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleInputChange}
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
            
            {/* Main Images */}
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

            {/* Thumbnail */}
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
                          <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt={`Area ${area.id} Image ${index + 1}`}
                            className="w-full h-16 object-cover rounded"
                          />
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
                        {formData.location || 'Location'}
                      </p>
                      <p className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {formData.capacity || '100-200 guests'}
                      </p>
                      <p className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ₹{formData.minPrice ? parseInt(formData.minPrice).toLocaleString('en-IN') : '50,000'} onwards
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
                      {formData.location || 'Location'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {formData.capacity || '100-200 guests'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ₹{formData.minPrice ? parseInt(formData.minPrice).toLocaleString('en-IN') : '50,000'} onwards
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

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewTab(previewTab === 'listing' ? 'detailed' : 'listing')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Venue'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueForm;