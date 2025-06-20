import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, Plus, Eye, Save, ArrowLeft, Camera, MapPin, Calendar, Building, ChevronDown, Search } from 'lucide-react';

interface InvitationFormProps {
  onBack: () => void;
  invitation?: any;
  mode: 'add' | 'edit';
}

interface Service {
  id: number;
  name: string;
}

interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface PolicyPoint {
  id: number;
  point: string;
}

const InvitationForm: React.FC<InvitationFormProps> = ({ onBack, invitation, mode }) => {
  const [formData, setFormData] = useState({
    name: invitation?.name || '',
    locations: invitation?.locations || [],
    occasionTypes: invitation?.occasionTypes || [],
    description: invitation?.description || '',
    featured: invitation?.featured || false,
    vendorOfMonth: invitation?.vendorOfMonth || false,
    contactPerson: invitation?.contactPerson || '',
    contactPhone: invitation?.contactPhone || '',
    contactEmail: invitation?.contactEmail || '',
    address: invitation?.address || '',
    businessHours: invitation?.businessHours || '',
    whatsappLink: invitation?.whatsappLink || '',
    instagramLink: invitation?.instagramLink || '',
    facebookLink: invitation?.facebookLink || '',
    website: invitation?.website || '',
  });

  const [services, setServices] = useState<Service[]>([
    { id: 1, name: invitation?.services?.[0] || '' }
  ]);
  const [features, setFeatures] = useState<Feature[]>([
    { 
      id: 1, 
      icon: 'award', 
      title: invitation?.features?.[0]?.title || '', 
      description: invitation?.features?.[0]?.description || '' 
    }
  ]);
  const [paymentPolicies, setPaymentPolicies] = useState<PolicyPoint[]>([
    { id: 1, point: invitation?.paymentPolicies?.[0] || '' }
  ]);
  const [orderProcess, setOrderProcess] = useState<PolicyPoint[]>([
    { id: 1, point: invitation?.orderProcess?.[0] || '' }
  ]);
  const [otherInfo, setOtherInfo] = useState<PolicyPoint[]>([
    { id: 1, point: invitation?.otherInfo?.[0] || '' }
  ]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [designImages, setDesignImages] = useState<File[]>([]);
  const [designImagesPreviews, setDesignImagesPreviews] = useState<string[]>([]);
  const [designVideos, setDesignVideos] = useState<File[]>([]);
  const [designVideosPreviews, setDesignVideosPreviews] = useState<string[]>([]);
  const [previewTab, setPreviewTab] = useState<'listing' | 'detailed'>('listing');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [occasionDropdownOpen, setOccasionDropdownOpen] = useState(false);
  const [occasionSearch, setOccasionSearch] = useState('');
  const [customOccasion, setCustomOccasion] = useState('');
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const designImagesInputRef = useRef<HTMLInputElement>(null);
  const designVideosInputRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const occasionRef = useRef<HTMLDivElement>(null);

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur'
  ];

  const occasionOptions = [
    'Marriage', 'Engagement', 'Reception', 'Anniversary', 'Birthday', 
    'Baby Shower', 'Housewarming', 'Corporate Events'
  ];

  const iconOptions = [
    { value: 'award', text: 'Award' },
    { value: 'palette', text: 'Palette' },
    { value: 'clock', text: 'Clock' },
    { value: 'gem', text: 'Gem' },
    { value: 'heart', text: 'Heart' },
    { value: 'star', text: 'Star' },
    { value: 'shield', text: 'Shield' },
    { value: 'thumbs-up', text: 'Thumbs Up' }
  ];

  const filteredLocationOptions = locationOptions.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredOccasionOptions = occasionOptions.filter(occasion =>
    occasion.toLowerCase().includes(occasionSearch.toLowerCase())
  );

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

  const handleOccasionToggle = (occasion: string) => {
    setFormData(prev => {
      const currentOccasions = prev.occasionTypes;
      const newOccasions = currentOccasions.includes(occasion)
        ? currentOccasions.filter(o => o !== occasion)
        : [...currentOccasions, occasion];
      return { ...prev, occasionTypes: newOccasions };
    });
    if (errors.occasionTypes) {
      setErrors(prev => ({ ...prev, occasionTypes: '' }));
    }
  };

  const handleAddCustomOccasion = () => {
    if (customOccasion.trim() && !formData.occasionTypes.includes(customOccasion.trim())) {
      setFormData(prev => ({
        ...prev,
        occasionTypes: [...prev.occasionTypes, customOccasion.trim()]
      }));
      setCustomOccasion('');
      if (errors.occasionTypes) {
        setErrors(prev => ({ ...prev, occasionTypes: '' }));
      }
    }
  };

  const handleRemoveOccasion = (occasionToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      occasionTypes: prev.occasionTypes.filter(occasion => occasion !== occasionToRemove)
    }));
  };

  const handleServiceChange = (id: number, value: string) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, name: value } : service
      )
    );
  };

  const addService = () => {
    setServices(prev => [...prev, { id: Date.now(), name: '' }]);
  };

  const removeService = (id: number) => {
    if (services.length > 1) {
      setServices(prev => prev.filter(service => service.id !== id));
    }
  };

  const handleFeatureChange = (id: number, field: string, value: string) => {
    setFeatures(prev =>
      prev.map(feature =>
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    );
  };

  const addFeature = () => {
    const newId = Date.now();
    setFeatures(prev => [...prev, { id: newId, icon: 'award', title: '', description: '' }]);
  };

  const removeFeature = (id: number) => {
    if (features.length > 1) {
      setFeatures(prev => prev.filter(feature => feature.id !== id));
    }
  };

  const handlePolicyChange = (id: number, value: string, setState: React.Dispatch<React.SetStateAction<PolicyPoint[]>>) => {
    setState(prev =>
      prev.map(item =>
        item.id === id ? { ...item, point: value } : item
      )
    );
  };

  const addPolicy = (setState: React.Dispatch<React.SetStateAction<PolicyPoint[]>>) => {
    setState(prev => [...prev, { id: Date.now(), point: '' }]);
  };

  const removePolicy = (id: number, setState: React.Dispatch<React.SetStateAction<PolicyPoint[]>>) => {
    setState(prev => {
      if (prev.length > 1) {
        return prev.filter(item => item.id !== id);
      }
      return prev;
    });
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      if (errors.thumbnail) {
        setErrors(prev => ({ ...prev, thumbnail: '' }));
      }
    }
  };

  const handleDesignImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 4);
      setDesignImages(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setDesignImagesPreviews(previews);
      if (errors.designImages) {
        setErrors(prev => ({ ...prev, designImages: '' }));
      }
    }
  };

  const handleDesignVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 2);
      setDesignVideos(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setDesignVideosPreviews(previews);
      if (errors.designVideos) {
        setErrors(prev => ({ ...prev, designVideos: '' }));
      }
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview('');
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  const removeDesignImage = (index: number) => {
    setDesignImages(prev => prev.filter((_, i) => i !== index));
    setDesignImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeDesignVideo = (index: number) => {
    setDesignVideos(prev => prev.filter((_, i) => i !== index));
    setDesignVideosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Shop name is required';
    if (formData.locations.length === 0) newErrors.locations = 'At least one location is required';
    if (formData.occasionTypes.length === 0) newErrors.occasionTypes = 'At least one occasion type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!thumbnail && mode === 'add') {
      newErrors.thumbnail = 'Thumbnail image is required';
    }
    if (designImages.length !== 4 && mode === 'add') {
      newErrors.designImages = 'Exactly 4 design images are required';
    }
    if (designVideos.length !== 2 && mode === 'add') {
      newErrors.designVideos = 'Exactly 2 design videos are required';
    }
    const validServices = services.filter(s => s.name.trim());
    if (validServices.length === 0) {
      newErrors.services = 'At least one service is required';
    }
    const validFeatures = features.filter(f => f.title.trim() && f.description.trim());
    if (validFeatures.length === 0) {
      newErrors.features = 'At least one feature is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Invitation shop data:', {
        ...formData,
        services: services.filter(s => s.name.trim()),
        features: features.filter(f => f.title.trim() && f.description.trim()),
        paymentPolicies: paymentPolicies.filter(p => p.point.trim()),
        orderProcess: orderProcess.filter(p => p.point.trim()),
        otherInfo: otherInfo.filter(p => p.point.trim()),
        thumbnail,
        designImages,
        designVideos
      });
      alert(`Invitation shop ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      onBack();
    } catch (error) {
      alert('Failed to save invitation shop. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invitation shop? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Invitation shop deleted successfully!');
        onBack();
      } catch (error) {
        alert('Failed to delete invitation shop. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationDropdownOpen(false);
        setLocationSearch('');
      }
      if (occasionRef.current && !occasionRef.current.contains(e.target as Node)) {
        setOccasionDropdownOpen(false);
        setOccasionSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl mx-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'add' ? 'Add New Invitation Shop' : 'Edit Invitation Shop'}
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
              <span>{isLoading ? 'Saving...' : 'Save Shop'}</span>
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
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter shop name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locations * (Select multiple or add custom)
                </label>
                <div className="relative" ref={locationRef}>
                  <button
                    type="button"
                    onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
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
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Search locations..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={customLocation}
                            onChange={(e) => setCustomLocation(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredLocationOptions.map(location => (
                          <label
                            key={location}
                            className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.locations.includes(location)}
                              onChange={() => handleLocationToggle(location)}
                              className="mr-3 text-blue-600 focus:ring-blue-500"
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
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {location}
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(location)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
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
                  Occasion Types * (Select multiple or add custom)
                </label>
                <div className="relative" ref={occasionRef}>
                  <button
                    type="button"
                    onClick={() => setOccasionDropdownOpen(!occasionDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
                      errors.occasionTypes ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <span className={formData.occasionTypes.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.occasionTypes.length > 0 
                        ? `${formData.occasionTypes.length} occasion${formData.occasionTypes.length > 1 ? 's' : ''} selected`
                        : 'Select Occasion Types'
                      }
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${occasionDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {occasionDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="p-3 border-b border-gray-200">
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            value={occasionSearch}
                            onChange={(e) => setOccasionSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Search occasions..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={customOccasion}
                            onChange={(e) => setCustomOccasion(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Enter custom occasion"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomOccasion();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomOccasion}
                            disabled={!customOccasion.trim()}
                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredOccasionOptions.map(occasion => (
                          <label
                            key={occasion}
                            className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.occasionTypes.includes(occasion)}
                              onChange={() => handleOccasionToggle(occasion)}
                              className="mr-3 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{occasion}</span>
                          </label>
                        ))}
                        {filteredOccasionOptions.length === 0 && occasionSearch && (
                          <div className="px-4 py-2 text-gray-500 text-sm">No occasions found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {formData.occasionTypes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.occasionTypes.map(occasion => (
                      <span
                        key={occasion}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {occasion}
                        <button
                          type="button"
                          onClick={() => handleRemoveOccasion(occasion)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.occasionTypes && <p className="text-red-500 text-sm mt-1">{errors.occasionTypes}</p>}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter a brief description of the shop"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="mt-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Featured Shop</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="vendorOfMonth"
                  checked={formData.vendorOfMonth}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Vendor of the Month</span>
              </label>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-purple-600" />
              Media
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image *
              </label>
              <p className="text-sm text-gray-500 mb-2">This image will appear on shop cards (500x500px, square ratio)</p>
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click to upload thumbnail</p>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnail}
                  className="hidden"
                />
              </div>
              {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
              
              {thumbnailPreview && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-32 h-32 object-cover rounded-lg"
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

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Images (Upload 4 images) *
              </label>
              <p className="text-sm text-gray-500 mb-2">Upload exactly 4 high quality images (1200x800px)</p>
              <div
                onClick={() => designImagesInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  errors.designImages ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag & drop images here or click to browse</p>
                <p className="text-sm text-gray-500">Select exactly 4 images</p>
                <input
                  ref={designImagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDesignImages}
                  className="hidden"
                />
              </div>
              {errors.designImages && <p className="text-red-500 text-sm mt-1">{errors.designImages}</p>}
              
              {designImagesPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {designImagesPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Design ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeDesignImage(index)}
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
                Design Videos (Upload 2 videos) *
              </label>
              <p className="text-sm text-gray-500 mb-2">Upload exactly 2 videos (MP4 format, max 30MB each)</p>
              <div
                onClick={() => designVideosInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  errors.designVideos ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag & drop videos here or click to browse</p>
                <p className="text-sm text-gray-500">Select exactly 2 videos</p>
                <input
                  ref={designVideosInputRef}
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleDesignVideos}
                  className="hidden"
                />
              </div>
              {errors.designVideos && <p className="text-red-500 text-sm mt-1">{errors.designVideos}</p>}
              
              {designVideosPreviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {designVideosPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <video
                        src={preview}
                        controls
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeDesignVideo(index)}
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

          {/* Services */}
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Services Offered</h3>
              <button
                onClick={addService}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Service</span>
              </button>
            </div>
            {errors.services && <p className="text-red-500 text-sm mb-4">{errors.services}</p>}

            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => handleServiceChange(service.id, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Service name"
                  />
                  {services.length > 1 && (
                    <button
                      onClick={() => removeService(service.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-yellow-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Why Choose Us</h3>
              <button
                onClick={addFeature}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Feature</span>
              </button>
            </div>
            {errors.features && <p className="text-red-500 text-sm mb-4">{errors.features}</p>}

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={feature.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-800">Feature {index + 1}</h4>
                    {features.length > 1 && (
                      <button
                        onClick={() => removeFeature(feature.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <select
                        value={feature.icon}
                        onChange={(e) => handleFeatureChange(feature.id, 'icon', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      >
                        {iconOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.text}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => handleFeatureChange(feature.id, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                        placeholder="Feature title"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(feature.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      placeholder="Feature description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Policies</h3>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-800">Payment Policies</h4>
                <button
                  onClick={() => addPolicy(setPaymentPolicies)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Policy</span>
                </button>
              </div>
              <div className="space-y-3">
                {paymentPolicies.map((policy) => (
                  <div key={policy.id} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={policy.point}
                      onChange={(e) => handlePolicyChange(policy.id, e.target.value, setPaymentPolicies)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter payment policy point"
                    />
                    {paymentPolicies.length > 1 && (
                      <button
                        onClick={() => removePolicy(policy.id, setPaymentPolicies)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-800">Order Process</h4>
                <button
                  onClick={() => addPolicy(setOrderProcess)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Step</span>
                </button>
              </div>
              <div className="space-y-3">
                {orderProcess.map((step) => (
                  <div key={step.id} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={step.point}
                      onChange={(e) => handlePolicyChange(step.id, e.target.value, setOrderProcess)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter order process step"
                    />
                    {orderProcess.length > 1 && (
                      <button
                        onClick={() => removePolicy(step.id, setOrderProcess)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-800">Other Information</h4>
                <button
                  onClick={() => addPolicy(setOtherInfo)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Info</span>
                </button>
              </div>
              <div className="space-y-3">
                {otherInfo.map((info) => (
                  <div key={info.id} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={info.point}
                      onChange={(e) => handlePolicyChange(info.id, e.target.value, setOtherInfo)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter other information point"
                    />
                    {otherInfo.length > 1 && (
                      <button
                        onClick={() => removePolicy(info.id, setOtherInfo)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                <input
                  type="text"
                  name="businessHours"
                  value={formData.businessHours}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Monday - Saturday: 9:00 AM - 8:00 PM"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Social Media Links</h4>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                placeholder="Website URL"
              />
              <input
                type="url"
                name="whatsappLink"
                value={formData.whatsappLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                placeholder="WhatsApp Link"
              />
              <input
                type="url"
                name="instagramLink"
                value={formData.instagramLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                placeholder="Instagram Link"
              />
              <input
                type="url"
                name="facebookLink"
                value={formData.facebookLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                placeholder="Facebook Link"
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Shop Preview</h3>
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
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="Shop Thumbnail"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {formData.name || 'Shop Name'}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {formData.locations.length > 0 ? formData.locations.join(', ') : 'Locations'}
                      </p>
                      <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formData.occasionTypes.length > 0 ? formData.occasionTypes.join(', ') : 'Occasion Types'}
                      </p>
                      <p className="mt-2 text-gray-700">
                        {formData.description || 'Shop description will appear here'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    {formData.name || 'Shop Name'}
                  </h4>
                  <p className="text-gray-600">{formData.description || 'Shop description'}</p>
                </div>

                {services.filter(s => s.name.trim()).length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Our Services</h5>
                    <div className="flex flex-wrap gap-2">
                      {services.filter(s => s.name.trim()).map((service, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {service.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {features.filter(f => f.title.trim() && f.description.trim()).length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Why Choose Us</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.filter(f => f.title.trim() && f.description.trim()).map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-yellow-600 text-xs">★</span>
                          </div>
                          <div>
                            <h6 className="font-medium text-gray-800">{feature.title}</h6>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {designImagesPreviews.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Portfolio</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {designImagesPreviews.slice(0, 4).map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
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

export default InvitationForm;