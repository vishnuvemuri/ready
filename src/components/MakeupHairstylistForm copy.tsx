import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, Plus, Eye, Save, ArrowLeft, Camera, MapPin, Users, Palette, DollarSign, ChevronDown, Search } from 'lucide-react';

interface MakeupHairstylistFormProps {
  onClose: () => void;
  artist?: any; // For editing existing artist
  mode: 'add' | 'edit';
}

interface Service {
  id: number;
  name: string;
  price: string;
  duration: string;
  description: string;
}

const MakeupHairstylistForm: React.FC<MakeupHairstylistFormProps> = ({ onClose, artist, mode }) => {
  const [formData, setFormData] = useState({
    name: artist?.name || '',
    location: artist?.location || '',
    specialization: artist?.specialization || [],
    type: artist?.type || '',
    minPrice: artist?.minPrice || '',
    description: artist?.description || '',
    detailedDescription: artist?.detailedDescription || '',
    featured: artist?.featured || false,
    bestOfMonth: artist?.bestOfMonth || false,
    packageName: artist?.packageName || '',
    packagePrice: artist?.packagePrice || '',
    packageDescription: artist?.packageDescription || '',
    yearsExperience: artist?.yearsExperience || '',
    happyClients: artist?.happyClients || '',
    premiumProducts: artist?.premiumProducts || '',
    completedLooks: artist?.completedLooks || '',
    contactPhone: artist?.contactPhone || '',
    contactEmail: artist?.contactEmail || '',
    address: artist?.address || '',
    workingHours: artist?.workingHours || '',
    whatsappLink: artist?.whatsappLink || '',
    instagramLink: artist?.instagramLink || '',
    facebookLink: artist?.facebookLink || '',
  });

  const [services, setServices] = useState<Service[]>([
    { id: 1, name: '', price: '', duration: '', description: '' },
  ]);

  const [highlights, setHighlights] = useState<string[]>(['', '', '', '']);
  const [inclusions, setInclusions] = useState<string[]>(['']);
  const [awards, setAwards] = useState<string[]>(['']);
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewTab, setPreviewTab] = useState<'listing' | 'portfolio'>('listing');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dropdown states
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [specializationDropdownOpen, setSpecializationDropdownOpen] = useState(false);

  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Pune'
  ];

  const specializationOptions = [
    'Makeup & Hairstyling', 'Skincare & Grooming', 'Mehendi & Nail Art', 
    'Groom Styling & Haircare', 'Beard Styling & Shaving'
  ];

  const typeOptions = ['Bridal', 'Groom', 'Both'];

  // Filter options based on search
  const filteredLocationOptions = locationOptions.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
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

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => {
      const currentSpecs = prev.specialization;
      const newSpecs = currentSpecs.includes(specialization)
        ? currentSpecs.filter(s => s !== specialization)
        : [...currentSpecs, specialization];
      return { ...prev, specialization: newSpecs };
    });
    if (errors.specialization) {
      setErrors(prev => ({ ...prev, specialization: '' }));
    }
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
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

  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const removePortfolioImage = (index: number) => {
    setPortfolioImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  const removeVideo = () => {
    setVideo(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    if (profileInputRef.current) {
      profileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Artist name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.specialization.length === 0) newErrors.specialization = 'At least one specialization is required';
    if (!formData.type) newErrors.type = 'Artist type is required';
    if (!formData.minPrice) newErrors.minPrice = 'Starting price is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';
    if (!formData.detailedDescription.trim()) newErrors.detailedDescription = 'Detailed description is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    if (portfolioImages.length === 0 && mode === 'add') {
      newErrors.portfolioImages = 'At least one portfolio image is required';
    }
    if (!thumbnail && mode === 'add') {
      newErrors.thumbnail = 'Thumbnail image is required';
    }
    if (!profileImage && mode === 'add') {
      newErrors.profileImage = 'Profile image is required';
    }

    const validServices = services.filter(s => s.name.trim() && s.price.trim());
    if (validServices.length === 0) {
      newErrors.services = 'At least one service with name and price is required';
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
      
      console.log('Artist data:', {
        ...formData,
        services: services.filter(s => s.name.trim()),
        highlights: highlights.filter(h => h.trim()),
        inclusions: inclusions.filter(i => i.trim()),
        awards: awards.filter(a => a.trim()),
        portfolioImages,
        thumbnail,
        video,
        profileImage
      });
      
      alert(`Artist ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      onClose();
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Artist deleted successfully!');
        onClose();
      } catch (error) {
        alert('Failed to delete artist. Please try again.');
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
              onClick={() => setPreviewTab(previewTab === 'listing' ? 'portfolio' : 'listing')}
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

              {/* Multi-Select Specialization Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization * (Select multiple)
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSpecializationDropdownOpen(!specializationDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
                      errors.specialization ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <span className={formData.specialization.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.specialization.length > 0 
                        ? `${formData.specialization.length} specialization${formData.specialization.length > 1 ? 's' : ''} selected`
                        : 'Select Specializations'
                      }
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${specializationDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {specializationDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="max-h-48 overflow-y-auto">
                        {specializationOptions.map(spec => (
                          <label
                            key={spec}
                            className="flex items-center px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.specialization.includes(spec)}
                              onChange={() => handleSpecializationToggle(spec)}
                              className="mr-3 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-gray-700">{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {formData.specialization.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.specialization.map(spec => (
                      <span
                        key={spec}
                        className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => handleSpecializationToggle(spec)}
                          className="ml-1 text-purple-600 hover:text-purple-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
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
                  <option value="">Select Type</option>
                  {typeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price (₹) *
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.minPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter starting price"
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
                placeholder="Enter a brief description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="mt-4 flex items-center space-x-6">
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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="bestOfMonth"
                  checked={formData.bestOfMonth}
                  onChange={handleInputChange}
                  className="mr-2 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Best of the Month</span>
              </label>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-gray-50 rounded-xl p-6">
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
                onClick={() => thumbnailInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
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

            {/* Portfolio Video */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Video
              </label>
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload portfolio video</p>
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

            {/* Profile Image */}
            <div>
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
          </div>

          {/* Detailed Information */}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
              <div className="space-y-3">
                {highlights.map((highlight, index) => (
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

          {/* Services & Packages */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Services & Packages
            </h3>
            {errors.services && <p className="text-red-500 text-sm mb-4">{errors.services}</p>}
            
            <div className="space-y-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Bridal Makeup"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="15000"
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
                    {services.length > 1 && (
                      <button
                        onClick={() => removeService(service.id)}
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={service.description}
                      onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                      rows={2}
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

            {/* Package Information */}
            <div className="mt-8 space-y-4">
              <h4 className="text-lg font-medium text-gray-800">Package Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    type="number"
                    name="packagePrice"
                    value={formData.packagePrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="25000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Description</label>
                <textarea
                  name="packageDescription"
                  value={formData.packageDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Package description"
                />
              </div>

              {/* Package Inclusions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Inclusions</label>
                <div className="space-y-2">
                  {inclusions.map((inclusion, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={inclusion}
                        onChange={(e) => handleInclusionChange(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Inclusion"
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
                  className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                >
                  Add Inclusion
                </button>
              </div>
            </div>
          </div>

          {/* Stats & Achievements */}
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
                  placeholder="100"
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
                  placeholder="50"
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
                  placeholder="200"
                />
              </div>
            </div>

            {/* Awards */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Awards & Recognitions</label>
              <div className="space-y-2">
                {awards.map((award, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={award}
                      onChange={(e) => handleAwardChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Award"
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
                className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
              >
                Add Award
              </button>
            </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                <input
                  type="text"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="9 AM - 6 PM"
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

          {/* Preview Section */}
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
                  onClick={() => setPreviewTab('portfolio')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    previewTab === 'portfolio'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Portfolio View
                </button>
              </div>
            </div>

            {previewTab === 'listing' ? (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex space-x-4">
                  {thumbnail && (
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Artist Thumbnail"
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {formData.name || 'Artist Name'}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <Palette className="h-4 w-4 mr-1" />
                        {formData.specialization.length ? formData.specialization.join(', ') : 'Specialization'}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {formData.location || 'Location'}
                      </p>
                      <p className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ₹{formData.minPrice ? parseInt(formData.minPrice).toLocaleString('en-IN') : '5,000'} onwards
                      </p>
                      <p className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {formData.type || 'Type'}
                      </p>
                    </div>
                    <p className="text-gray-600 mt-2">
                      {formData.description || 'No description provided'}
                    </p>
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
                        <div key={service.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium">{service.name}</span>
                          <span className="text-purple-600 font-semibold">₹{service.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {portfolioImages.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">My Portfolio</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {portfolioImages.slice(0, 3).map((file, index) => (
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
                    <div className="text-2xl font-bold text-purple-600">{formData.premiumProducts || '0'}%</div>
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
              onClick={() => setPreviewTab(previewTab === 'listing' ? 'portfolio' : 'listing')}
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
              <span>{isLoading ? 'Saving...' : 'Save Artist'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeupHairstylistForm;