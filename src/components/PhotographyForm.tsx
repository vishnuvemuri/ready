// src/components/PhotographyForm.tsx

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, Plus, Eye, Save, ArrowLeft, Camera, MapPin, Users, DollarSign, ChevronDown, Search } from 'lucide-react';

interface PhotographyFormProps {
  onBack: () => void; // MODIFIED: Changed from onClose to onBack
  photography?: any;
  mode: 'add' | 'edit';
}

interface Package {
  id: number;
  name: string;
  price: string;
  duration: string;
  deliverables: string;
  description: string;
}

const PhotographyForm: React.FC<PhotographyFormProps> = ({ onBack, photography, mode }) => { // MODIFIED: Changed from onClose to onBack
  const [formData, setFormData] = useState({
    name: photography?.name || '',
    locations: photography?.locations || [],
    styles: photography?.styles || [],
    experience: photography?.experience || '',
    startingPrice: photography?.startingPrice || '',
    description: photography?.description || '',
    detailedDescription: photography?.detailedDescription || '',
    featured: photography?.featured || false,
    contactPerson: photography?.contactPerson || '',
    contactPhone: photography?.contactPhone || '',
    contactEmail: photography?.contactEmail || '',
    studioAddress: photography?.studioAddress || '',
    whatsappLink: photography?.whatsappLink || '',
    instagramLink: photography?.instagramLink || '',
    facebookLink: photography?.facebookLink || '',
    website: photography?.website || '',
    weddingsShot: photography?.weddingsShot || '',
    yearsExperience: photography?.yearsExperience || '',
    happyClients: photography?.happyClients || '',
    awardsWon: photography?.awardsWon || '',
  });

  const [packages, setPackages] = useState<Package[]>([
    { id: 1, name: '', price: '', duration: '', deliverables: '', description: '' },
  ]);

  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [previewTab, setPreviewTab] = useState<'listing' | 'detailed'>('listing');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [styleSearch, setStyleSearch] = useState('');
  const [customStyle, setCustomStyle] = useState('');

  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Chennai', 'Kolkata', 'Pune',
    'Hyderabad', 'Ahmedabad', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal'
  ];

  const styleOptions = [
    'Traditional', 'Candid', 'Pre-Wedding', 'Destination', 'Portrait', 'Documentary',
    'Fine Art', 'Vintage', 'Contemporary', 'Cinematic', 'Fashion', 'Lifestyle'
  ];

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

  const handleStyleToggle = (style: string) => {
    setFormData(prev => {
      const currentStyles = prev.styles;
      const newStyles = currentStyles.includes(style)
        ? currentStyles.filter(s => s !== style)
        : [...currentStyles, style];
      return { ...prev, styles: newStyles };
    });
    if (errors.styles) {
      setErrors(prev => ({ ...prev, styles: '' }));
    }
  };

  const handleAddCustomStyle = () => {
    if (customStyle.trim() && !formData.styles.includes(customStyle.trim())) {
      setFormData(prev => ({
        ...prev,
        styles: [...prev.styles, customStyle.trim()]
      }));
      setCustomStyle('');
      if (errors.styles) {
        setErrors(prev => ({ ...prev, styles: '' }));
      }
    }
  };

  const handleRemoveStyle = (styleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      styles: prev.styles.filter(style => style !== styleToRemove)
    }));
  };

  const handlePackageChange = (id: number, field: string, value: string) => {
    setPackages(prev =>
      prev.map(pkg =>
        pkg.id === id ? { ...pkg, [field]: value } : pkg
      )
    );
  };

  const addPackage = () => {
    const newId = packages.length > 0 ? Math.max(...packages.map(pkg => pkg.id)) + 1 : 1;
    setPackages(prev => [
      ...prev,
      { id: newId, name: '', price: '', duration: '', deliverables: '', description: '' },
    ]);
  };

  const removePackage = (id: number) => {
    if (packages.length > 1) {
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
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

    if (!formData.name.trim()) newErrors.name = 'Photographer name is required';
    if (formData.locations.length === 0) newErrors.locations = 'At least one location is required';
    if (formData.styles.length === 0) newErrors.styles = 'At least one photography style is required';
    if (!formData.experience.trim()) newErrors.experience = 'Years of experience is required';
    if (!formData.startingPrice.trim()) newErrors.startingPrice = 'Starting price is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';
    if (!formData.detailedDescription.trim()) newErrors.detailedDescription = 'Detailed description is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';

    const validPackages = packages.filter(pkg => pkg.name.trim() && pkg.price.trim());
    if (validPackages.length === 0) {
      newErrors.packages = 'At least one package with name and price is required';
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
      
      console.log('Photography data:', {
        ...formData,
        packages: packages.filter(pkg => pkg.name.trim()),
        portfolioImages,
        profileImage,
        video
      });
      
      alert(`Photographer ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      onBack(); // MODIFIED: Changed from onClose to onBack
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Photographer deleted successfully!');
        onBack(); // MODIFIED: Changed from onClose to onBack
      } catch (error) {
        alert('Failed to delete photographer. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // MODIFIED: Removed the outer modal div. The component now returns the form content directly.
  return (
    <div className="bg-white rounded-2xl shadow-xl w-full">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10 rounded-t-2xl">
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
              <Camera className="h-5 w-5 mr-2 text-purple-600" />
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter photographer name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="md:col-span-2">
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photography Style * (Select multiple or add custom)
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStyleDropdownOpen(!styleDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
                      errors.styles ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <span className={formData.styles.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.styles.length > 0 
                        ? `${formData.styles.length} style${formData.styles.length > 1 ? 's' : ''} selected`
                        : 'Select Photography Styles'
                      }
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${styleDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {styleDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="p-3 border-b border-gray-200">
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            value={styleSearch}
                            onChange={(e) => setStyleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Search photography styles..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={customStyle}
                            onChange={(e) => setCustomStyle(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            placeholder="Enter custom style"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomStyle();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomStyle}
                            disabled={!customStyle.trim()}
                            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredStyleOptions.map(style => (
                          <label
                            key={style}
                            className="flex items-center px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.styles.includes(style)}
                              onChange={() => handleStyleToggle(style)}
                              className="mr-3 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-gray-700">{style}</span>
                          </label>
                        ))}
                        {filteredStyleOptions.length === 0 && styleSearch && (
                          <div className="px-4 py-2 text-gray-500 text-sm">No styles found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {formData.styles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.styles.map(style => (
                      <span
                        key={style}
                        className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {style}
                        <button
                          type="button"
                          onClick={() => handleRemoveStyle(style)}
                          className="ml-1 text-purple-600 hover:text-purple-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.styles && <p className="text-red-500 text-sm mt-1">{errors.styles}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter years"
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price (₹) *
                </label>
                <input
                  type="number"
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.startingPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter starting price"
                />
                {errors.startingPrice && <p className="text-red-500 text-sm mt-1">{errors.startingPrice}</p>}
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

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Featured Photographer</span>
              </label>
            </div>
          </div>

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
                <p className="text-sm text-gray-500">Recommended: 10-20 high quality images (1200x800px)</p>
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
                Video Reel
              </label>
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
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
                About the Photographer *
              </label>
              <textarea
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.detailedDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Provide detailed information about the photographer"
              />
              {errors.detailedDescription && <p className="text-red-500 text-sm mt-1">{errors.detailedDescription}</p>}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
              Photography Packages
            </h3>
            {errors.packages && <p className="text-red-500 text-sm mb-4">{errors.packages}</p>}
            
            <div className="space-y-6">
              {packages.map((pkg, index) => (
                <div key={pkg.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-medium text-gray-800">Package {index + 1}</h5>
                    {packages.length > 1 && (
                      <button
                        onClick={() => removePackage(pkg.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => handlePackageChange(pkg.id, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Wedding Photography"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => handlePackageChange(pkg.id, 'price', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={pkg.duration}
                        onChange={(e) => handlePackageChange(pkg.id, 'duration', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="8 hours"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deliverables</label>
                      <input
                        type="text"
                        value={pkg.deliverables}
                        onChange={(e) => handlePackageChange(pkg.id, 'deliverables', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="500 edited photos"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={pkg.description}
                      onChange={(e) => handlePackageChange(pkg.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Package description"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addPackage}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Package</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weddings Shot</label>
                <input
                  type="number"
                  name="weddingsShot"
                  value={formData.weddingsShot}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter number"
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
                  placeholder="Enter number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Awards Won</label>
                <input
                  type="number"
                  name="awardsWon"
                  value={formData.awardsWon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter number"
                />
              </div>
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
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Website URL"
                />
              </div>
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
                  {profileImage && (
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Photographer Profile"
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
                        {formData.locations.length > 0 ? formData.locations.join(', ') : 'Locations'}
                      </p>
                      <p className="flex items-center">
                        <Camera className="h-4 w-4 mr-1" />
                        {formData.styles.length > 0 ? formData.styles.join(', ') : 'Photography Styles'}
                      </p>
                      <p className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ₹{formData.startingPrice ? parseInt(formData.startingPrice).toLocaleString('en-IN') : '25,000'} onwards
                      </p>
                      <p className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {formData.experience || '0'} years experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    {formData.name || 'Photographer Name'}
                  </h4>
                  <p className="text-gray-600">{formData.detailedDescription || 'No detailed description provided'}</p>
                </div>

                {packages.filter(p => p.name.trim()).length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Photography Packages</h5>
                    <div className="space-y-2">
                      {packages.filter(p => p.name.trim()).map((pkg) => (
                        <div key={pkg.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <h6 className="font-medium text-gray-800">{pkg.name}</h6>
                            <span className="text-purple-600 font-semibold">₹{pkg.price ? parseInt(pkg.price).toLocaleString('en-IN') : '0'}</span>
                          </div>
                          {pkg.description && <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>}
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
                    <div className="text-2xl font-bold text-purple-600">{formData.experience || '0'}+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{formData.weddingsShot || '0'}+</div>
                    <div className="text-sm text-gray-600">Weddings Shot</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{formData.happyClients || '0'}+</div>
                    <div className="text-sm text-gray-600">Happy Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{formData.awardsWon || '0'}+</div>
                    <div className="text-sm text-gray-600">Awards Won</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between z-10 rounded-b-2xl">
          <button
            onClick={onBack} // MODIFIED: Changed from onClose to onBack
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
  );
};

export default PhotographyForm;