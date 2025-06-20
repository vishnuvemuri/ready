import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, Plus, Eye, Save, ArrowLeft, Camera, MapPin, Users, DollarSign, ChevronDown, Search, Video, Star } from 'lucide-react';

interface PhotographyFormProps {
  onClose: () => void;
  photography?: any; // For editing existing photographer
  mode: 'add' | 'edit';
}

interface Service {
  id: number;
  name: string;
  price: string;
}

const PhotographyForm: React.FC<PhotographyFormProps> = ({ onClose, photography, mode }) => {
  const [formData, setFormData] = useState({
    name: photography?.name || '',
    location: photography?.location || '',
    style: photography?.style || [],
    budget: photography?.budget || '',
    description: photography?.description || '',
    about: photography?.about || '',
    featured: photography?.featured || false,
    packageName: photography?.packageName || '',
    packagePrice: photography?.packagePrice || '',
    yearsBusiness: photography?.yearsBusiness || '',
    eventsDone: photography?.eventsDone || '',
    crewSize: photography?.crewSize || '',
    contactPerson: photography?.contactPerson || '',
    contactPhone: photography?.contactPhone || '',
    contactEmail: photography?.contactEmail || '',
    studioAddress: photography?.studioAddress || '',
    whatsappLink: photography?.whatsappLink || '',
    instagramLink: photography?.instagramLink || '',
    facebookLink: photography?.facebookLink || '',
  });

  const [services, setServices] = useState<Service[]>([
    { id: 1, name: '', price: '' }
  ]);
  const [inclusions, setInclusions] = useState<string[]>(['']);
  const [highlights, setHighlights] = useState<string[]>(['', '', '', '']);
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [previewTab, setPreviewTab] = useState<'listing' | 'detailed'>('listing');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dropdown states
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [styleSearch, setStyleSearch] = useState('');
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);

  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Chennai', 'Kolkata', 'Pune',
    'Hyderabad', 'Ahmedabad', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal'
  ];

  const styleOptions = [
    'Traditional', 'Candid', 'Pre-wedding', 'Destination', 'Cinematic',
    'Documentary', 'Portrait', 'Fashion', 'Commercial', 'Event'
  ];

  const budgetOptions = [
    { value: '50000', text: '₹50,000' },
    { value: '100000', text: '₹1 Lakh' },
    { value: '150000', text: '₹1.5 Lakh' },
    { value: '200000', text: '₹2 Lakh' },
    { value: '300000', text: '₹3 Lakh' },
    { value: '500000', text: '₹5 Lakh' },
    { value: '700000', text: '₹7 Lakh' },
    { value: '900000', text: '₹9 Lakh' },
    { value: '1000000', text: '₹10 Lakh' },
  ];

  // Filter options based on search
  const filteredLocationOptions = locationOptions.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredStyleOptions = styleOptions.filter(style =>
    style.toLowerCase().includes(styleSearch.toLowerCase())
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

  const handleStyleToggle = (style: string) => {
    setFormData(prev => {
      const currentStyles = prev.style;
      const newStyles = currentStyles.includes(style)
        ? currentStyles.filter(s => s !== style)
        : [...currentStyles, style];
      return { ...prev, style: newStyles };
    });
    if (errors.style) {
      setErrors(prev => ({ ...prev, style: '' }));
    }
  };

  const handleBudgetSelect = (budget: string) => {
    setFormData(prev => ({ ...prev, budget }));
    setBudgetDropdownOpen(false);
    if (errors.budget) {
      setErrors(prev => ({ ...prev, budget: '' }));
    }
  };

  const handleServiceChange = (id: number, field: string, value: string) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const addService = () => {
    const newId = Math.max(...services.map(s => s.id)) + 1;
    setServices(prev => [...prev, { id: newId, name: '', price: '' }]);
  };

  const removeService = (id: number) => {
    if (services.length > 1) {
      setServices(prev => prev.filter(service => service.id !== id));
    }
  };

  const handleInclusionChange = (index: number, value: string) => {
    setInclusions(prev => {
      const newInclusions = [...prev];
      newInclusions[index] = value;
      return newInclusions;
    });
  };

  const addInclusion = () => {
    setInclusions(prev => [...prev, '']);
  };

  const removeInclusion = (index: number) => {
    if (inclusions.length > 1) {
      setInclusions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleHighlightChange = (index: number, value: string) => {
    setHighlights(prev => {
      const newHighlights = [...prev];
      newHighlights[index] = value;
      return newHighlights;
    });
  };

  const handlePortfolioImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPortfolioImages(Array.from(e.target.files));
    }
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
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

  const removeThumbnail = () => {
    setThumbnail(null);
    if (thumbInputRef.current) {
      thumbInputRef.current.value = '';
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

    if (!formData.name.trim()) newErrors.name = 'Photographer name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.style.length === 0) newErrors.style = 'At least one photography style is required';
    if (!formData.budget) newErrors.budget = 'Budget range is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';
    if (!formData.about.trim()) newErrors.about = 'About the photographer is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';

    if (portfolioImages.length === 0 && mode === 'add') {
      newErrors.portfolioImages = 'At least one portfolio image is required';
    }
    if (!thumbnail && mode === 'add') {
      newErrors.thumbnail = 'Thumbnail image is required';
    }

    const hasServiceError = services.some(service => !service.name.trim() || !service.price.trim());
    if (hasServiceError) {
      newErrors.services = 'All services must have both name and price';
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
      
      console.log('Photography data:', {
        ...formData,
        services,
        inclusions,
        highlights,
        portfolioImages,
        thumbnail,
        video
      });
      
      alert(`Photographer ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      onClose();
    } catch (error) {
      alert('Failed to save photographer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this photographer? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Photographer deleted successfully!');
        onClose();
      } catch (error) {
        alert('Failed to delete photographer. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.custom-dropdown')) {
        setLocationDropdownOpen(false);
        setStyleDropdownOpen(false);
        setBudgetDropdownOpen(false);
        setLocationSearch('');
        setStyleSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'add' ? 'Add New Photographer' : 'Edit Photographer'}
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
              <span>{isLoading ? 'Saving...' : 'Save Photographer'}</span>
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
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photographer Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter photographer name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Single Select Searchable Location Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="custom-dropdown relative">
                  <button
                    type="button"
                    onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
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
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                              formData.location === location ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
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
                  Budget Range *
                </label>
                <div className="custom-dropdown relative">
                  <button
                    type="button"
                    onClick={() => setBudgetDropdownOpen(!budgetDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
                      errors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <span className={formData.budget ? 'text-gray-900' : 'text-gray-500'}>
                      {budgetOptions.find(opt => opt.value === formData.budget)?.text || 'Select Budget'}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${budgetDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {budgetDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="max-h-48 overflow-y-auto">
                        {budgetOptions.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleBudgetSelect(option.value)}
                            className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                              formData.budget === option.value ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                            }`}
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
              </div>

              {/* Multi-Select Photography Style Dropdown */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photography Style * (Select multiple)
                </label>
                <div className="custom-dropdown relative">
                  <button
                    type="button"
                    onClick={() => setStyleDropdownOpen(!styleDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
                      errors.style ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <span className={formData.style.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.style.length > 0 
                        ? `${formData.style.length} style${formData.style.length > 1 ? 's' : ''} selected`
                        : 'Select Photography Styles'
                      }
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${styleDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {styleDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            value={styleSearch}
                            onChange={(e) => setStyleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Search photography styles..."
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredStyleOptions.map(style => (
                          <label
                            key={style}
                            className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.style.includes(style)}
                              onChange={() => handleStyleToggle(style)}
                              className="mr-3 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{style}</span>
                          </label>
                        ))}
                        {filteredStyleOptions.length === 0 && (
                          <div className="px-4 py-2 text-gray-500 text-sm">No styles found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {formData.style.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.style.map(style => (
                      <span
                        key={style}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {style}
                        <button
                          type="button"
                          onClick={() => handleStyleToggle(style)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.style && <p className="text-red-500 text-sm mt-1">{errors.style}</p>}
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
                placeholder="Brief description that appears on listing cards"
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
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Photographer of the Month</span>
              </label>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-purple-600" />
              Media
            </h3>
            
            {/* Portfolio Images */}
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

            {/* Thumbnail */}
            <div className="mb-6">
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
                <p className="text-gray-600">This image will appear on photographer cards</p>
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

            {/* Video Reel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Reel
              </label>
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Upload video reel (MP4 format)</p>
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
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Remove Video
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Information */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Information</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About the Photographer *
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                  errors.about ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Detailed description that appears in the portfolio page"
              />
              {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
              <div className="space-y-3">
                {highlights.map((highlight, index) => (
                  <input
                    key={index}
                    type="text"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Highlight ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Services & Packages */}
          <div className="bg-yellow-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Services & Packages</h3>
            
            {/* Basic Package */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Basic Package</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                  <input
                    type="text"
                    name="packageName"
                    value={formData.packageName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Basic Wedding Package"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Price</label>
                  <input
                    type="text"
                    name="packagePrice"
                    value={formData.packagePrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., ₹50,000"
                  />
                </div>
              </div>

              {/* Package Inclusions */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Package Inclusions</label>
                  <button
                    onClick={addInclusion}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Inclusion</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {inclusions.map((inclusion, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={inclusion}
                        onChange={(e) => handleInclusionChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                        placeholder="Package inclusion"
                      />
                      {inclusions.length > 1 && (
                        <button
                          onClick={() => removeInclusion(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Services Offered</label>
                <button
                  onClick={addService}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Service</span>
                </button>
              </div>
              {errors.services && <p className="text-red-500 text-sm mb-4">{errors.services}</p>}
              
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., Candid Photography"
                        />
                      </div>
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                          <input
                            type="text"
                            value={service.price}
                            onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., 25,000"
                          />
                        </div>
                        {services.length > 1 && (
                          <button
                            onClick={() => removeService(service.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business</label>
                <input
                  type="text"
                  name="yearsBusiness"
                  value={formData.yearsBusiness}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 5+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Events Done</label>
                <input
                  type="text"
                  name="eventsDone"
                  value={formData.eventsDone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 500+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crew Size</label>
                <input
                  type="text"
                  name="crewSize"
                  value={formData.crewSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 3-5"
                />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Studio Address</label>
                <input
                  type="text"
                  name="studioAddress"
                  value={formData.studioAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
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
              <h3 className="text-lg font-semibold text-gray-800">Photographer Preview</h3>
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
                      alt="Photographer Thumbnail"
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {formData.name || 'Photographer Name'}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {formData.location || 'Location'}
                      </p>
                      <p className="flex items-center">
                        <Camera className="h-4 w-4 mr-1" />
                        {formData.style.length > 0 ? formData.style.join(', ') : 'Photography Style'}
                      </p>
                      <p className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {budgetOptions.find(opt => opt.value === formData.budget)?.text || 'Budget Range'}
                      </p>
                      {formData.featured && (
                        <p className="flex items-center text-yellow-600">
                          <Star className="h-4 w-4 mr-1" />
                          Photographer of the Month
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.description || 'No description provided'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    {formData.name || 'Photographer Name'}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {formData.location || 'Location'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Camera className="h-4 w-4 mr-1" />
                      {formData.style.length > 0 ? formData.style.join(', ') : 'Photography Style'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {budgetOptions.find(opt => opt.value === formData.budget)?.text || 'Budget Range'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {formData.crewSize || 'Crew Size'}
                    </div>
                  </div>
                </div>

                {formData.about && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">About the Photographer</h5>
                    <p className="text-gray-600 text-sm">{formData.about}</p>
                  </div>
                )}

                {highlights.some(h => h) && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Highlights</h5>
                    <div className="flex flex-wrap gap-2">
                      {highlights.filter(h => h).map((highlight, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {portfolioImages.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Portfolio Preview</h5>
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

                {services.some(s => s.name || s.price) && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Services</h5>
                    <div className="space-y-2">
                      {services.filter(s => s.name || s.price).map((service, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{service.name || 'Service Name'}</span>
                          <span>₹{service.price || '0'}</span>
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
              <span>{isLoading ? 'Saving...' : 'Save Photographer'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotographyForm;