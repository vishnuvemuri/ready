// src/components/EventAnchorForm.tsx

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, Plus, Eye, Save, ArrowLeft, Camera, MapPin, Users, Mic, DollarSign, ChevronDown, Search } from 'lucide-react';
import { Vendor } from '../types/vendor'; // MODIFIED: Import Vendor type for better type safety

// MODIFIED: Props interface updated to accept `onBack` and a nullable `anchor`
interface EventAnchorFormProps {
  onBack: () => void;
  anchor?: Vendor | null;
  mode: 'add' | 'edit';
}

interface Language {
  id: number;
  name: string;
}

interface Specialization {
  id: number;
  name: string;
  description: string;
}

// MODIFIED: Component signature updated to use `onBack` prop
const EventAnchorForm: React.FC<EventAnchorFormProps> = ({ onBack, anchor, mode }) => {
  const [formData, setFormData] = useState({
    // MODIFIED: Safely access anchor properties
    name: anchor?.name || '',
    locations: anchor?.location ? anchor.location.split(', ') : [], // Example of how to handle location string
    experience: anchor?.experience || '',
    budget: anchor?.budget || '',
    description: anchor?.description || '',
    detailedDescription: anchor?.detailedDescription || '',
    featured: anchor?.featured || false,
    contactPerson: anchor?.contactPerson || '',
    contactPhone: anchor?.contact || '', // MODIFIED: Map `contact` from Vendor to `contactPhone`
    contactEmail: anchor?.contactEmail || '',
    studioWebsite: anchor?.studioWebsite || '',
    whatsappLink: anchor?.whatsappLink || '',
    instagramLink: anchor?.instagramLink || '',
    facebookLink: anchor?.facebookLink || '',
    eventsHosted: anchor?.eventsHosted || '',
    citiesWorked: anchor?.citiesWorked || '',
    awardsWon: anchor?.awardsWon || '',
  });

  const [languages, setLanguages] = useState<Language[]>([
    { id: 1, name: '' },
  ]);
  const [specializations, setSpecializations] = useState<Specialization[]>([
    { id: 1, name: '', description: '' },
  ]);
  const [eventTypes, setEventTypes] = useState<string[]>(['', '', '', '']);
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [videoReels, setVideoReels] = useState<File[]>([]);
  const [previewTab, setPreviewTab] = useState<'listing' | 'detailed'>('listing');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dropdown states
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Chennai', 'Kolkata', 'Pune',
    'Hyderabad', 'Ahmedabad', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal'
  ];

  const languageOptions = [
    'Hindi', 'English', 'Punjabi', 'Marathi', 'Gujarati', 'Odia', 'Assamese', 'Sindhi',
    'Tamil', 'Telugu', 'Bengali', 'Kannada', 'Malayalam', 'Urdu', 'Kashmiri', 'Other'
  ];

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

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') {
      setFormData(prev => ({ ...prev, budget: '' }));
      return;
    }
    const formattedValue = Number(numericValue).toLocaleString('en-IN');
    setFormData(prev => ({
      ...prev,
      budget: formattedValue
    }));
    if (errors.budget) {
      setErrors(prev => ({ ...prev, budget: '' }));
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

  const handleLanguageChange = (id: number, value: string) => {
    setLanguages(prev =>
      prev.map(lang =>
        lang.id === id ? { ...lang, name: value } : lang
      )
    );
  };

  const addLanguage = () => {
    const newId = languages.length > 0 ? Math.max(...languages.map(lang => lang.id)) + 1 : 1;
    setLanguages(prev => [
      ...prev,
      { id: newId, name: '' },
    ]);
  };

  const removeLanguage = (id: number) => {
    if (languages.length > 1) {
      setLanguages(prev => prev.filter(lang => lang.id !== id));
    }
  };

  const handleSpecializationChange = (id: number, field: string, value: string) => {
    setSpecializations(prev =>
      prev.map(spec =>
        spec.id === id ? { ...spec, [field]: value } : spec
      )
    );
  };

  const addSpecialization = () => {
    const newId = specializations.length > 0 ? Math.max(...specializations.map(spec => spec.id)) + 1 : 1;
    setSpecializations(prev => [
      ...prev,
      { id: newId, name: '', description: '' },
    ]);
  };

  const removeSpecialization = (id: number) => {
    if (specializations.length > 1) {
      setSpecializations(prev => prev.filter(spec => spec.id !== id));
    }
  };

  const handleEventTypeChange = (index: number, value: string) => {
    const newEventTypes = [...eventTypes];
    newEventTypes[index] = value;
    setEventTypes(newEventTypes);
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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newVideos = Array.from(e.target.files);
      setVideoReels(prevReels => {
        const updatedReels = [...prevReels, ...newVideos];
        return updatedReels.slice(0, 2);
      });
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

  const removeVideo = (index: number) => {
    setVideoReels(prevReels => prevReels.filter((_, i) => i !== index));
    if (videoReels.length === 1 && videoInputRef.current) {
        videoInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Anchor name is required';
    if (formData.locations.length === 0) newErrors.locations = 'At least one location is required';
    if (!formData.experience.trim()) newErrors.experience = 'Years of experience is required';
    if (!formData.budget.trim()) newErrors.budget = 'Minimum budget is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';
    if (!formData.detailedDescription.trim()) newErrors.detailedDescription = 'Detailed description is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';
    const validLanguages = languages.filter(lang => lang.name.trim());
    if (validLanguages.length === 0) {
      newErrors.languages = 'At least one language is required';
    }
    const validSpecializations = specializations.filter(spec => spec.name.trim());
    if (validSpecializations.length === 0) {
      newErrors.specializations = 'At least one specialization is required';
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
      const budgetForApi = formData.budget.replace(/,/g, '');
      console.log('Anchor data:', {
        ...formData,
        budget: budgetForApi,
        languages: languages.filter(lang => lang.name.trim()),
        specializations: specializations.filter(spec => spec.name.trim()),
        eventTypes: eventTypes.filter(et => et.trim()),
        portfolioImages,
        profileImage,
        videoReels
      });
      alert(`Anchor ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      onBack(); // MODIFIED: Call onBack on successful submission
    } catch (error) {
      alert('Failed to save anchor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this anchor? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Anchor deleted successfully!');
        onBack(); // MODIFIED: Call onBack after successful deletion
      } catch (error) {
        alert('Failed to delete anchor. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // MODIFIED: Removed the modal wrapper (`fixed inset-0`) and the main dialog container.
  // The component now returns the form content directly, to be placed inside the page layout.
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl z-10">
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === 'add' ? 'Add New Event Anchor' : 'Edit Event Anchor'}
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
            <span>{isLoading ? 'Saving...' : 'Save Anchor'}</span>
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
            <Mic className="h-5 w-5 mr-2 text-purple-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anchor Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter anchor name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Multi-Select Searchable Location Dropdown with Custom Entry */}
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
                            className="mr-3 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
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
                Minimum Budget *
              </label>
              <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">₹</span>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleBudgetChange}
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        errors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter amount"
                    inputMode="numeric"
                  />
              </div>
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
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
                className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Mark as Featured Anchor</span>
            </label>
          </div>
        </div>

        {/* Languages & Specializations */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Languages & Specializations
          </h3>
          {/* Languages */}
          <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages Spoken *
              </label>
              {errors.languages && <p className="text-red-500 text-sm mb-2">{errors.languages}</p>}
              <div className="space-y-3">
                  {languages.map((language) => (
                      <div key={language.id} className="flex items-center space-x-3">
                          <select
                              value={language.name}
                              onChange={(e) => handleLanguageChange(language.id, e.target.value)}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          >
                              <option value="">Select Language</option>
                              {languageOptions.map(lang => (
                                  <option key={lang} value={lang}>{lang}</option>
                              ))}
                          </select>
                          {languages.length > 1 && (
                              <button
                                  type="button"
                                  onClick={() => removeLanguage(language.id)}
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
                  onClick={addLanguage}
                  className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                  <Plus className="h-4 w-4" />
                  <span>Add Language</span>
              </button>
          </div>
          {/* Specializations */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations *
              </label>
              {errors.specializations && <p className="text-red-500 text-sm mb-2">{errors.specializations}</p>}
              <div className="space-y-4">
                  {specializations.map((specialization) => (
                      <div key={specialization.id} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                              <input
                                  type="text"
                                  value={specialization.name}
                                  onChange={(e) => handleSpecializationChange(specialization.id, 'name', e.target.value)}
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                  placeholder="Specialization name"
                              />
                              {specializations.length > 1 && (
                                  <button
                                      type="button"
                                      onClick={() => removeSpecialization(specialization.id)}
                                      className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                                  >
                                      <Trash2 className="h-5 w-5" />
                                  </button>
                              )}
                          </div>
                          <textarea
                              value={specialization.description}
                              onChange={(e) => handleSpecializationChange(specialization.id, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                              placeholder="Description"
                          />
                      </div>
                  ))}
              </div>
              <button
                  type="button"
                  onClick={addSpecialization}
                  className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                  <Plus className="h-4 w-4" />
                  <span>Add Specialization</span>
              </button>
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

          {/* Profile Image */}
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

          {/* Video Reels Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Reels (Up to 2)
            </label>
            <div
              onClick={() => videoReels.length < 2 && videoInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                videoReels.length < 2
                  ? 'border-gray-300 hover:border-purple-500 hover:bg-purple-50 cursor-pointer'
                  : 'border-gray-300 bg-gray-100 cursor-not-allowed'
              }`}
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                {videoReels.length < 2 ? 'Upload video reel (MP4 format)' : 'You have uploaded the maximum of 2 videos.'}
              </p>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                className="hidden"
                disabled={videoReels.length >= 2}
              />
            </div>

            {videoReels.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {videoReels.map((file, index) => (
                  <div key={index} className="relative">
                    <video controls className="w-full h-48 object-cover rounded-lg">
                      <source src={URL.createObjectURL(file)} type={file.type} />
                      Your browser does not support the video tag.
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
        </div>

        {/* Detailed Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Information</h3>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About the Anchor *
            </label>
            <textarea
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                errors.detailedDescription ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Provide detailed information about the anchor"
            />
            {errors.detailedDescription && <p className="text-red-500 text-sm mt-1">{errors.detailedDescription}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Types</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventTypes.map((eventType, index) => (
                <input
                  key={index}
                  type="text"
                  value={eventType}
                  onChange={(e) => handleEventTypeChange(index, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Event Type ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Events Hosted</label>
              <input
                type="number"
                name="eventsHosted"
                value={formData.eventsHosted}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cities Worked In</label>
              <input
                type="number"
                name="citiesWorked"
                value={formData.citiesWorked}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Studio Website</label>
              <input
                type="text"
                name="studioWebsite"
                value={formData.studioWebsite}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter studio website"
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
            <h3 className="text-lg font-semibold text-gray-800">Anchor Preview</h3>
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
                    alt="Anchor Profile"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    {formData.name || 'Anchor Name'}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {formData.locations.length > 0 ? formData.locations.join(', ') : 'Locations'}
                    </p>
                    <p className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {languages.filter(l => l.name.trim()).map(l => l.name).join(', ') || 'Languages'}
                    </p>
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formData.budget ? `Starts from ₹${formData.budget}` : 'Budget not set'}
                    </p>
                    <p className="flex items-center">
                      <Mic className="h-4 w-4 mr-1" />
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
                  {formData.name || 'Anchor Name'}
                </h4>
                <p className="text-gray-600">{formData.detailedDescription || 'No detailed description provided'}</p>
              </div>
              {specializations.filter(s => s.name.trim()).length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Specializations</h5>
                  <div className="space-y-2">
                    {specializations.filter(s => s.name.trim()).map((spec) => (
                      <div key={spec.id} className="bg-gray-50 p-3 rounded-lg">
                        <h6 className="font-medium text-gray-800">{spec.name}</h6>
                        {spec.description && <p className="text-sm text-gray-600 mt-1">{spec.description}</p>}
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
                  <div className="text-2xl font-bold text-purple-600">{formData.eventsHosted || '0'}+</div>
                  <div className="text-sm text-gray-600">Events Hosted</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{formData.citiesWorked || '0'}+</div>
                  <div className="text-sm text-gray-600">Cities Worked</div>
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
      
    </div>
  );
};

export default EventAnchorForm;
