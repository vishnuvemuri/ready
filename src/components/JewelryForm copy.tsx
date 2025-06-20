import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, Plus, Eye, Save, ArrowLeft, Camera, MapPin, Building, ChevronDown, Search, Gem, Star, Heart, Phone, Store } from 'lucide-react';

interface JewelryFormProps {
  onClose: () => void;
  jewelry?: any; // For editing existing jewelry vendor
  mode: 'add' | 'edit';
}

interface CulturalCollection {
  id: number;
  name: string;
  link: string;
  image: File | null;
  imagePreview: string;
}

interface DesignItem {
  id: number;
  title: string;
  subtitle: string;
  modelImage: File | null;
  modelImagePreview: string;
  jewelryImage: File | null;
  jewelryImagePreview: string;
}

interface Occasion {
  id: number;
  caption: string;
  image: File | null;
  imagePreview: string;
}

interface StoreLocation {
  id: number;
  city: string;
  address: string;
}

const JewelryForm: React.FC<JewelryFormProps> = ({ onClose, jewelry, mode }) => {
  const [formData, setFormData] = useState({
    name: jewelry?.name || '',
    location: jewelry?.location || '',
    shortDescription: jewelry?.shortDescription || '',
    featured: jewelry?.featured || false,
    brandDescription: jewelry?.brandDescription || '',
    featuredLink: jewelry?.featuredLink || '',
    locatorText: jewelry?.locatorText || '',
    findNowText: jewelry?.findNowText || '',
    findNowLink: jewelry?.findNowLink || '',
    website: jewelry?.website || '',
    whatsapp: jewelry?.whatsapp || '',
    email: jewelry?.email || '',
    instagram: jewelry?.instagram || '',
    contactNumber: jewelry?.contactNumber || '',
    moreStoresLink: jewelry?.moreStoresLink || '',
  });

  // Dynamic sections
  const [culturalCollections, setCulturalCollections] = useState<CulturalCollection[]>([]);
  const [designItems, setDesignItems] = useState<DesignItem[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([]);

  // Image states
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [mainFeatured, setMainFeatured] = useState<File | null>(null);
  const [mainFeaturedPreview, setMainFeaturedPreview] = useState('');
  const [subFeatured, setSubFeatured] = useState<File | null>(null);
  const [subFeaturedPreview, setSubFeaturedPreview] = useState('');
  const [storeImages, setStoreImages] = useState<File[]>([]);
  const [storeImagesPreviews, setStoreImagesPreviews] = useState<string[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState('');

  const [previewTab, setPreviewTab] = useState<'listing' | 'detailed'>('listing');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dropdown states
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  // File input refs
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const mainFeaturedInputRef = useRef<HTMLInputElement>(null);
  const subFeaturedInputRef = useRef<HTMLInputElement>(null);
  const storeImagesInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Chennai', 'Kolkata', 'Pune',
    'Hyderabad', 'Ahmedabad', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal'
  ];

  // Filter location options based on search
  const filteredLocationOptions = locationOptions.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleImageUpload = (file: File | null, setFile: (file: File | null) => void, setPreview: (preview: string) => void) => {
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleStoreImagesUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setStoreImages(fileArray);
      const previews = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(previews).then(setStoreImagesPreviews);
    }
  };

  // Dynamic section handlers
  const addCulturalCollection = () => {
    setCulturalCollections(prev => [
      ...prev,
      { id: Date.now(), name: '', link: '', image: null, imagePreview: '' },
    ]);
  };

  const addDesignItem = () => {
    setDesignItems(prev => [
      ...prev,
      { id: Date.now(), title: '', subtitle: '', modelImage: null, modelImagePreview: '', jewelryImage: null, jewelryImagePreview: '' },
    ]);
  };

  const addOccasion = () => {
    setOccasions(prev => [
      ...prev,
      { id: Date.now(), caption: '', image: null, imagePreview: '' },
    ]);
  };

  const addStoreLocation = () => {
    setStoreLocations(prev => [
      ...prev,
      { id: Date.now(), city: '', address: '' },
    ]);
  };

  const removeEntry = (id: number, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
    setState(prev => prev.filter(item => item.id !== id));
  };

  const handleCulturalChange = (id: number, field: string, value: string) => {
    setCulturalCollections(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCulturalImageChange = (id: number, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCulturalCollections(prev =>
          prev.map(item =>
            item.id === id ? { ...item, image: file, imagePreview: e.target?.result as string } : item
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDesignChange = (id: number, field: string, value: string) => {
    setDesignItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDesignImageChange = (id: number, field: string, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDesignItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, [field]: file, [`${field}Preview`]: e.target?.result as string } : item
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOccasionChange = (id: number, field: string, value: string) => {
    setOccasions(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleOccasionImageChange = (id: number, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOccasions(prev =>
          prev.map(item =>
            item.id === id ? { ...item, image: file, imagePreview: e.target?.result as string } : item
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationChange = (id: number, field: string, value: string) => {
    setStoreLocations(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Jeweler name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.brandDescription.trim()) newErrors.brandDescription = 'Brand description is required';

    if (!thumbnail && mode === 'add') {
      newErrors.thumbnail = 'Thumbnail image is required';
    }
    if (!logo && mode === 'add') {
      newErrors.logo = 'Logo image is required';
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
      
      console.log('Jewelry vendor data:', {
        ...formData,
        culturalCollections,
        designItems,
        occasions,
        storeLocations,
        thumbnail,
        logo,
        mainFeatured,
        subFeatured,
        storeImages,
        backgroundImage
      });
      
      alert(`Jewelry vendor ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      onClose();
    } catch (error) {
      alert('Failed to save jewelry vendor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this jewelry vendor? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Jewelry vendor deleted successfully!');
        onClose();
      } catch (error) {
        alert('Failed to delete jewelry vendor. Please try again.');
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
            {mode === 'add' ? 'Add New Jewelry Vendor' : 'Edit Jewelry Vendor'}
          </h2>
          <div className="flex items-center space-x-3">
            {mode === 'edit' && (
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Jeweler</span>
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
              <span>{isLoading ? 'Saving...' : 'Save Jeweler'}</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jeweler Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter jeweler name"
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
            </div>

            {/* Thumbnail Image */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image *
              </label>
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload thumbnail</p>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0] || null, setThumbnail, setThumbnailPreview)}
                  className="hidden"
                />
              </div>
              {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
              
              {thumbnailPreview && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview('');
                      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description for main page listing"
              />
              {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>}
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
                <span className="text-sm font-medium text-gray-700">Mark as Featured Jeweler</span>
              </label>
            </div>
          </div>

          {/* Brand Information */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Gem className="h-5 w-5 mr-2 text-purple-600" />
              Brand Information
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Image *
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
                  onChange={(e) => handleImageUpload(e.target.files?.[0] || null, setLogo, setLogoPreview)}
                  className="hidden"
                />
              </div>
              {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
              
              {logoPreview && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setLogo(null);
                      setLogoPreview('');
                      if (logoInputRef.current) logoInputRef.current.value = '';
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Description *
              </label>
              <textarea
                name="brandDescription"
                value={formData.brandDescription}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.brandDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Detailed brand description for portfolio"
              />
              {errors.brandDescription && <p className="text-red-500 text-sm mt-1">{errors.brandDescription}</p>}
            </div>
          </div>

          {/* Cultural Bridal Collections */}
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Gem className="h-5 w-5 mr-2 text-green-600" />
                Cultural Bridal Collections
              </h3>
              <button
                onClick={addCulturalCollection}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Cultural Collection</span>
              </button>
            </div>

            <div className="space-y-6">
              {culturalCollections.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-800">Cultural Collection</h4>
                    <button
                      onClick={() => removeEntry(item.id, setCulturalCollections)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Culture Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleCulturalChange(item.id, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Bengali, Punjabi, South Indian"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                      <input
                        type="url"
                        value={item.link}
                        onChange={(e) => handleCulturalChange(item.id, 'link', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCulturalImageChange(item.id, e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    {item.imagePreview && (
                      <div className="mt-2">
                        <img
                          src={item.imagePreview}
                          alt="Culture Preview"
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Design Led Jewellery */}
          <div className="bg-yellow-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-600" />
                Design Led Jewellery
              </h3>
              <button
                onClick={addDesignItem}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Design Item</span>
              </button>
            </div>

            <div className="space-y-6">
              {designItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-800">Design Item</h4>
                    <button
                      onClick={() => removeEntry(item.id, setDesignItems)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleDesignImageChange(item.id, 'modelImage', e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      />
                      {item.modelImagePreview && (
                        <div className="mt-2">
                          <img
                            src={item.modelImagePreview}
                            alt="Model Preview"
                            className="w-32 h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jewelry Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleDesignImageChange(item.id, 'jewelryImage', e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      />
                      {item.jewelryImagePreview && (
                        <div className="mt-2">
                          <img
                            src={item.jewelryImagePreview}
                            alt="Jewelry Preview"
                            className="w-32 h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleDesignChange(item.id, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                        placeholder="Design title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={item.subtitle}
                        onChange={(e) => handleDesignChange(item.id, 'subtitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                        placeholder="Design subtitle"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Collections */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-indigo-600" />
              Featured Collections
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Featured Image</label>
                <div
                  onClick={() => mainFeaturedInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload main featured image</p>
                  <input
                    ref={mainFeaturedInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] || null, setMainFeatured, setMainFeaturedPreview)}
                    className="hidden"
                  />
                </div>
                {mainFeaturedPreview && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={mainFeaturedPreview}
                      alt="Main Featured Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setMainFeatured(null);
                        setMainFeaturedPreview('');
                        if (mainFeaturedInputRef.current) mainFeaturedInputRef.current.value = '';
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Featured Image</label>
                <div
                  onClick={() => subFeaturedInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload sub featured image</p>
                  <input
                    ref={subFeaturedInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] || null, setSubFeatured, setSubFeaturedPreview)}
                    className="hidden"
                  />
                </div>
                {subFeaturedPreview && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={subFeaturedPreview}
                      alt="Sub Featured Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setSubFeatured(null);
                        setSubFeaturedPreview('');
                        if (subFeaturedInputRef.current) subFeaturedInputRef.current.value = '';
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Link</label>
              <input
                type="url"
                name="featuredLink"
                value={formData.featuredLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Wedding Occasion Jewellery */}
          <div className="bg-pink-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-pink-600" />
                Wedding Occasion Jewellery
              </h3>
              <button
                onClick={addOccasion}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Occasion</span>
              </button>
            </div>

            <div className="space-y-6">
              {occasions.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-800">Occasion Item</h4>
                    <button
                      onClick={() => removeEntry(item.id, setOccasions)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleOccasionImageChange(item.id, e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      />
                      {item.imagePreview && (
                        <div className="mt-2">
                          <img
                            src={item.imagePreview}
                            alt="Occasion Preview"
                            className="w-32 h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => handleOccasionChange(item.id, 'caption', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                        placeholder="Occasion caption"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Locator */}
          <div className="bg-teal-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-teal-600" />
              Store Locator
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Locator Text</label>
              <textarea
                name="locatorText"
                value={formData.locatorText}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Visit our stores"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Images</label>
                <div
                  onClick={() => storeImagesInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Upload store images</p>
                  <input
                    ref={storeImagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleStoreImagesUpload(e.target.files)}
                    className="hidden"
                  />
                </div>
                {storeImagesPreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {storeImagesPreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Store Image ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                <div
                  onClick={() => backgroundImageInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Upload background image</p>
                  <input
                    ref={backgroundImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] || null, setBackgroundImage, setBackgroundImagePreview)}
                    className="hidden"
                  />
                </div>
                {backgroundImagePreview && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={backgroundImagePreview}
                      alt="Background Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setBackgroundImage(null);
                        setBackgroundImagePreview('');
                        if (backgroundImageInputRef.current) backgroundImageInputRef.current.value = '';
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Find Now Button Text</label>
                <input
                  type="text"
                  name="findNowText"
                  value={formData.findNowText}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Find Now"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Find Now Button Link</label>
                <input
                  type="url"
                  name="findNowLink"
                  value={formData.findNowLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Contact and Social Media */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-gray-600" />
              Contact and Social Media
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Link</label>
                <input
                  type="url"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://wa.me/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Link</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Store Locations */}
          <div className="bg-orange-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Store className="h-5 w-5 mr-2 text-orange-600" />
                Store Locations
              </h3>
              <button
                onClick={addStoreLocation}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Store Location</span>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {storeLocations.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-800">Store Location</h4>
                    <button
                      onClick={() => removeEntry(item.id, setStoreLocations)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={item.city}
                        onChange={(e) => handleLocationChange(item.id, 'city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder="City name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={item.address}
                        onChange={(e) => handleLocationChange(item.id, 'address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder="Full address"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">More Stores Link</label>
              <input
                type="url"
                name="moreStoresLink"
                value={formData.moreStoresLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Jeweler Preview</h3>
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
                      alt="Jeweler Thumbnail"
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="text-sm text-purple-600 mb-1">
                      {formData.location || 'Location'}
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {formData.name || 'Jeweler Name'}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {formData.shortDescription || 'Short Description'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">
                    {formData.name || 'Jeweler Name'}
                  </h4>
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Jeweler Logo"
                      className="w-24 h-16 object-contain mx-auto mb-4"
                    />
                  )}
                  <p className="text-gray-600">
                    {formData.brandDescription || 'Brand Description'}
                  </p>
                </div>

                {culturalCollections.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Cultural Bridal Collections</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {culturalCollections.map((item) => (
                        item.imagePreview && (
                          <div key={item.id} className="text-center">
                            <img
                              src={item.imagePreview}
                              alt="Culture"
                              className="w-full h-16 object-cover rounded mb-1"
                            />
                            {item.name && <p className="text-xs text-gray-600">{item.name}</p>}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {(mainFeaturedPreview || subFeaturedPreview) && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Featured Collections</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {mainFeaturedPreview && (
                        <img
                          src={mainFeaturedPreview}
                          alt="Main Featured"
                          className="w-full h-24 object-cover rounded"
                        />
                      )}
                      {subFeaturedPreview && (
                        <img
                          src={subFeaturedPreview}
                          alt="Sub Featured"
                          className="w-full h-24 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                )}

                {formData.contactNumber && (
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-gray-600">Contact: {formData.contactNumber}</p>
                    {formData.website && (
                      <p className="text-blue-600 text-sm">{formData.website}</p>
                    )}
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
              <span>{isLoading ? 'Saving...' : 'Save Jeweler'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryForm;