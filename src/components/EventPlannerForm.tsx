import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, Plus, Eye, Save, ArrowLeft, Camera, MapPin, Users, Calendar, DollarSign, ChevronDown, Search } from 'lucide-react';

interface EventPlannerFormProps {
  onBack: () => void; // MODIFIED: Changed from onClose to onBack
  planner?: any; 
  mode: 'add' | 'edit';
}

interface Service {
  id: number;
  name: string;
  icon: string;
  description: string;
}

interface Partner {
  id: number;
  name: string;
  logo: File | null;
  logoPreview: string;
}

const EventPlannerForm: React.FC<EventPlannerFormProps> = ({ onBack, planner, mode }) => { // MODIFIED: Changed from onClose to onBack
  const [formData, setFormData] = useState({
    name: planner?.name || '',
    location: planner?.location || [],
    experience: planner?.experience || '',
    minBudget: planner?.minBudget || '',
    maxBudget: planner?.maxBudget || '',
    specialty: planner?.specialty || [],
    description: planner?.description || '',
    detailedDescription: planner?.detailedDescription || '',
    featured: planner?.featured || false,
    contactPerson: planner?.contactPerson || '',
    contactPhone: planner?.contactPhone || '',
    contactEmail: planner?.contactEmail || '',
    address: planner?.address || '',
    website: planner?.website || '',
    instagramLink: planner?.instagramLink || '',
    facebookLink: planner?.facebookLink || '',
    pinterestLink: planner?.pinterestLink || '',
  });

  const [highlights, setHighlights] = useState<string[]>(['', '', '', '']);
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: '', icon: 'fas fa-ring', description: '' },
  ]);
  const [partners, setPartners] = useState<Partner[]>([
    { id: 1, name: '', logo: null, logoPreview: '' },
  ]);

  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [previewTab, setPreviewTab] = useState<'listing' | 'portfolio'>('listing');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dropdown states
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [specialtyDropdownOpen, setSpecialtyDropdownOpen] = useState(false);
  const [specialtySearch, setSpecialtySearch] = useState('');


  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Pune'
  ];

  const specialtyOptions = [
    'Luxury Weddings', 'Destination Weddings', 'Traditional Weddings',
    'Theme Weddings', 'Intimate Weddings', 'Corporate Events'
  ];

  const iconOptions = [
    { value: 'fas fa-ring', text: 'Ring' },
    { value: 'fas fa-paint-brush', text: 'Paint Brush' },
    { value: 'fas fa-music', text: 'Music' },
    { value: 'fas fa-film', text: 'Film' },
    { value: 'fas fa-microphone', text: 'Microphone' },
    { value: 'fas fa-gem', text: 'Gem' },
    { value: 'fas fa-map-marker-alt', text: 'Location' },
    { value: 'fas fa-columns', text: 'Stage' },
    { value: 'fas fa-envelope-open-text', text: 'Invitation' },
    { value: 'fas fa-video', text: 'Video' },
  ];

  // Filter options based on search
  const filteredLocationOptions = locationOptions.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredSpecialtyOptions = specialtyOptions.filter(specialty =>
    specialty.toLowerCase().includes(specialtySearch.toLowerCase())
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

  const handleLocationSelect = (location: string) => {
    const newLocation = formData.location.includes(location)
      ? formData.location.filter(l => l !== location)
      : [...formData.location, location];

    setFormData(prev => ({ ...prev, location: newLocation }));

    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  const handleAddCustomLocation = () => {
    if (locationSearch && !formData.location.includes(locationSearch)) {
      setFormData(prev => ({ ...prev, location: [...prev.location, locationSearch] }));
      setLocationSearch('');
    }
  };

  const handleSpecialtySelect = (specialty: string) => {
    const newSpecialty = formData.specialty.includes(specialty)
      ? formData.specialty.filter(s => s !== specialty)
      : [...formData.specialty, specialty];

    setFormData(prev => ({ ...prev, specialty: newSpecialty }));

    if (errors.specialty) {
      setErrors(prev => ({ ...prev, specialty: '' }));
    }
  };

  const handleAddCustomSpecialty = () => {
    if (specialtySearch && !formData.specialty.includes(specialtySearch)) {
      setFormData(prev => ({ ...prev, specialty: [...prev.specialty, specialtySearch] }));
      setSpecialtySearch('');
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
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    setServices(prev => [
      ...prev,
      { id: newId, name: '', icon: 'fas fa-ring', description: '' },
    ]);
  };

  const removeService = (id: number) => {
    if (services.length > 1) {
      setServices(prev => prev.filter(service => service.id !== id));
    }
  };

  const handlePartnerChange = (id: number, field: string, value: string) => {
    setPartners(prev =>
      prev.map(partner =>
        partner.id === id ? { ...partner, [field]: value } : partner
      )
    );
  };

  const handlePartnerLogo = (id: number, file: File | null) => {
    if (file) {
      setPartners(prev =>
        prev.map(partner =>
          partner.id === id
            ? { ...partner, logo: file, logoPreview: URL.createObjectURL(file) }
            : partner
        )
      );
    }
  };

  const addPartner = () => {
    const newId = partners.length > 0 ? Math.max(...partners.map(p => p.id)) + 1 : 1;
    setPartners(prev => [
      ...prev,
      { id: newId, name: '', logo: null, logoPreview: '' },
    ]);
  };

  const removePartner = (id: number) => {
    if (partners.length > 1) {
      setPartners(prev => prev.filter(partner => partner.id !== id));
    }
  };

  const handleGalleryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryImages(Array.from(e.target.files));
    }
  };

  const handleVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideos(Array.from(e.target.files));
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

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Planner name is required';
    if (formData.location.length === 0) newErrors.location = 'Location is required';
    if (!formData.experience.trim()) newErrors.experience = 'Years of experience is required';
    if (!formData.minBudget.trim()) newErrors.minBudget = 'Minimum budget is required';
    if (formData.specialty.length === 0) newErrors.specialty = 'Specialty is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';
    if (!formData.detailedDescription.trim()) newErrors.detailedDescription = 'Detailed description is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    if (galleryImages.length === 0 && mode === 'add') {
      newErrors.galleryImages = 'At least one gallery image is required';
    }
    if (!thumbnail && mode === 'add') {
      newErrors.thumbnail = 'Thumbnail image is required';
    }
    if (!logo && mode === 'add') {
      newErrors.logo = 'Logo is required';
    }

    const validServices = services.filter(s => s.name.trim());
    if (validServices.length === 0) {
      newErrors.services = 'At least one service is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Event Planner data:', {
        ...formData,
        highlights: highlights.filter(h => h.trim()),
        services: services.filter(s => s.name.trim()),
        partners: partners.filter(p => p.name.trim()),
        galleryImages,
        videos,
        thumbnail,
        logo
      });

      alert(`Event Planner ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      onBack(); // MODIFIED: Changed from onClose to onBack
    } catch (error) {
      alert('Failed to save planner. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this planner? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Event Planner deleted successfully!');
        onBack(); // MODIFIED: Changed from onClose to onBack
      } catch (error) {
        alert('Failed to delete planner. Please try again.');
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
          {mode === 'add' ? 'Add New Event Planner' : 'Edit Event Planner'}
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
            <span>{isLoading ? 'Saving...' : 'Save Planner'}</span>
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
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planner Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter planner name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Multi-select Searchable Location Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <span className={formData.location.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.location.length > 0 ? `${formData.location.length} selected` : 'Select Locations'}
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
                            placeholder="Search or add location..."
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredLocationOptions.map(location => (
                          <button
                            key={location}
                            type="button"
                            onClick={() => handleLocationSelect(location)}
                            className={`w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors ${formData.location.includes(location) ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                              }`}
                          >
                            {location}
                          </button>
                        ))}
                        {filteredLocationOptions.length === 0 && locationSearch && (
                          <button
                            type="button"
                            onClick={handleAddCustomLocation}
                            className="w-full px-4 py-2 text-left text-purple-600 hover:bg-purple-50"
                          >
                            Add "{locationSearch}"
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {formData.location.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.location.map(loc => (
                      <div key={loc} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm flex items-center">
                        {loc}
                        <button onClick={() => handleLocationSelect(loc)} className="ml-2">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter years"
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Budget (₹) *
                </label>
                <input
                  type="number"
                  name="minBudget"
                  value={formData.minBudget}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.minBudget ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter minimum budget"
                />
                {errors.minBudget && <p className="text-red-500 text-sm mt-1">{errors.minBudget}</p>}
              </div>

              {/* Multi-select Searchable Specialty Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSpecialtyDropdownOpen(!specialtyDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${errors.specialty ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <span className={formData.specialty.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.specialty.length > 0 ? `${formData.specialty.length} selected` : 'Select Specialties'}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${specialtyDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {specialtyDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            value={specialtySearch}
                            onChange={(e) => setSpecialtySearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Search or add specialty..."
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredSpecialtyOptions.map(specialty => (
                          <button
                            key={specialty}
                            type="button"
                            onClick={() => handleSpecialtySelect(specialty)}
                            className={`w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors ${formData.specialty.includes(specialty) ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                              }`}
                          >
                            {specialty}
                          </button>
                        ))}
                        {filteredSpecialtyOptions.length === 0 && specialtySearch && (
                          <button
                            type="button"
                            onClick={handleAddCustomSpecialty}
                            className="w-full px-4 py-2 text-left text-purple-600 hover:bg-purple-50"
                          >
                            Add "{specialtySearch}"
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {formData.specialty.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.specialty.map(spec => (
                      <div key={spec} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm flex items-center">
                        {spec}
                        <button onClick={() => handleSpecialtySelect(spec)} className="ml-2">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.description ? 'border-red-500' : 'border-gray-300'
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
                <span className="text-sm font-medium text-gray-700">Mark as Featured Planner</span>
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
                onClick={() => galleryInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${errors.galleryImages ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                  }`}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag & drop images here or click to browse</p>
                <p className="text-sm text-gray-500">Recommended: 5-10 high quality images (1200x800px)</p>
                <input
                  ref={galleryInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryImages}
                  className="hidden"
                />
              </div>
              {errors.galleryImages && <p className="text-red-500 text-sm mt-1">{errors.galleryImages}</p>}

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {galleryImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Portfolio Videos */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Videos
              </label>
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload videos</p>
                <p className="text-sm text-gray-500">MP4 format, max 50MB each</p>
                <input
                  ref={videoInputRef}
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideos}
                  className="hidden"
                />
              </div>

              {videos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {videos.map((file, index) => (
                    <div key={index} className="relative">
                      <video controls className="w-full h-24 object-cover rounded-lg">
                        <source src={URL.createObjectURL(file)} type={file.type} />
                      </video>
                      <button
                        onClick={() => removeVideo(index)}
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
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                  }`}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload thumbnail</p>
                <p className="text-sm text-gray-500">This image will appear on planner cards</p>
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

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo *
              </label>
              <div
                onClick={() => logoInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${errors.logo ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                  }`}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload logo</p>
                <p className="text-sm text-gray-500">This will appear in the portfolio header</p>
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
          </div>

          {/* Detailed Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Information</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About This Planner *
              </label>
              <textarea
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.detailedDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Provide detailed information about the planner"
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

          {/* Services */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Services
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
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Service Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon *</label>
                        <select
                          value={service.icon}
                          onChange={(e) => handleServiceChange(service.id, 'icon', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          {iconOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.text}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  <div className='mt-4'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
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
          </div>

          {/* Trusted Partners */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-600" />
              Trusted Partners
            </h3>

            <div className="space-y-6">
              {partners.map((partner, index) => (
                <div key={partner.id} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-800">Partner {index + 1}</h4>
                    {partners.length > 1 && (
                      <button
                        onClick={() => removePartner(partner.id)}
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Partner Name *</label>
                        <input
                          type="text"
                          value={partner.name}
                          onChange={(e) => handlePartnerChange(partner.id, 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Partner Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Partner Logo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePartnerLogo(partner.id, e.target.files?.[0] || null)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                        {partner.logoPreview && (
                          <img
                            src={partner.logoPreview}
                            alt="Partner Logo"
                            className="mt-2 w-16 h-12 object-contain rounded"
                          />
                        )}
                      </div>
                    </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPartner}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Partner</span>
            </button>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter website URL"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Social Media Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input
                    type="url"
                    name="facebookLink"
                    value={formData.facebookLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Facebook Link"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pinterest</label>
                  <input
                    type="url"
                    name="pinterestLink"
                    value={formData.pinterestLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Pinterest Link"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Planner Preview</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPreviewTab('listing')}
                  className={`px-4 py-2 rounded-lg transition-colors ${previewTab === 'listing'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  Listing View
                </button>
                <button
                  onClick={() => setPreviewTab('portfolio')}
                  className={`px-4 py-2 rounded-lg transition-colors ${previewTab === 'portfolio'
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
                      alt="Planner Thumbnail"
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {formData.name || 'Planner Name'}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {formData.location.join(', ') || 'Location'}
                      </p>
                      <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formData.experience || '0'} years experience
                      </p>
                      <p className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ₹{formData.minBudget ? parseInt(formData.minBudget).toLocaleString('en-IN') : '50,000'} - ₹{formData.maxBudget ? parseInt(formData.maxBudget).toLocaleString('en-IN') : '1,00,000'}
                      </p>
                      <p className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {formData.specialty.join(', ') || 'Specialty'}
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
                    {formData.name || 'Planner Name'}
                  </h4>
                  <p className="text-gray-600">{formData.detailedDescription || 'No detailed description provided'}</p>
                </div>

                {services.filter(s => s.name.trim()).length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Our Services</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {services.filter(s => s.name.trim()).map((service) => (
                        <div key={service.id} className="text-center bg-gray-50 p-4 rounded-lg">
                          <i className={`${service.icon} text-2xl text-purple-600 mb-2`}></i>
                          <h6 className="font-medium text-gray-800">{service.name}</h6>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {galleryImages.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Signature Wedding Moments</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {galleryImages.slice(0, 4).map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {partners.filter(p => p.name.trim()).length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Our Trusted Partners</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {partners.filter(p => p.name.trim()).map((partner) => (
                        <div key={partner.id} className="text-center">
                          {partner.logoPreview ? (
                            <img
                              src={partner.logoPreview}
                              alt={partner.name}
                              className="w-full h-16 object-contain rounded-lg mb-2"
                            />
                          ) : (
                            <div className="w-full h-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Logo</span>
                            </div>
                          )}
                          <p className="text-sm font-medium">{partner.name}</p>
                        </div>
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

export default EventPlannerForm;
