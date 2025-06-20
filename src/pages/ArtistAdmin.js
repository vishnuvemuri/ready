import React, { useState, useEffect, useRef } from 'react';
import './ArtistAdmin.css';
import axios from 'axios';
import Compressor from 'compressorjs';

const ArtistAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    specialization: [],
    type: '',
    minPrice: '',
    
    description: '',
    detailedDescription: '',
    featured: false,
    bestOfMonth: false,
    packageName: '',
    packagePrice: '',
    packageDescription: '',
    yearsExperience: '',
    happyClients: '',
    premiumProducts: '',
    completedLooks: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    workingHours: '',
    whatsappLink: '',
    instagramLink: '',
    facebookLink: '',
  });

  const [services, setServices] = useState([
    { id: 1, name: '', price: '', duration: '', description: '' },
  ]);

  const [inclusions, setInclusions] = useState(['']);
  const [awards, setAwards] = useState(['']);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewTab, setPreviewTab] = useState('listing');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [specializationDropdownOpen, setSpecializationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const portfolioInputRef = useRef(null);
  const thumbInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const profileInputRef = useRef(null);
  const locationRef = useRef(null);
  const specializationRef = useRef(null);
  const searchInputRef = useRef(null);

  const locationOptions = [
    { value: '', text: 'Select Location' },
    { value: 'Mumbai', text: 'Mumbai' },
    { value: 'Delhi', text: 'Delhi' },
    { value: 'Bangalore', text: 'Bangalore' },
    { value: 'Hyderabad', text: 'Hyderabad' },
    { value: 'Chennai', text: 'Chennai' },
  ];

  const specializationOptions = [
    { value: 'Makeup & Hairstyling', text: 'Makeup & Hairstyling' },
    { value: 'Skincare & Grooming', text: 'Skincare & Grooming' },
    { value: 'Mehendi & Nail Art', text: 'Mehendi & Nail Art' },
    { value: 'Groom Styling & Haircare', text: 'Groom Styling & Haircare' },
    { value: 'Beard Styling & Shaving', text: 'Beard Styling & Shaving' },
  ];

  const typeOptions = [
    { value: '', text: 'Select Type' },
    { value: 'Bridal', text: 'Bridal' },
    { value: 'Groom', text: 'Groom' },
    { value: 'Both', text: 'Both' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationSelect = (value) => {
    setFormData((prev) => ({ ...prev, location: value }));
    setLocationDropdownOpen(false);
    setSearchQuery('');
  };

  const handleSpecializationToggle = (value) => {
    setFormData((prev) => {
      const newSpecializations = prev.specialization.includes(value)
        ? prev.specialization.filter((spec) => spec !== value)
        : [...prev.specialization, value];
      return { ...prev, specialization: newSpecializations };
    });
  };

  const filteredLocationOptions = locationOptions.filter((option) =>
    option.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceChange = (id, field, value) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const addService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: Math.max(...prev.map((s) => s.id)) + 1,
        name: '',
        price: '',
        duration: '',
        description: '',
      },
    ]);
  };

  const removeService = (id) => {
    if (services.length > 1) {
      setServices((prev) => prev.filter((service) => service.id !== id));
    } else {
      alert('You must have at least one service');
    }
  };

  const handleInclusionChange = (index, value) => {
    setInclusions((prev) => {
      const newInclusions = [...prev];
      newInclusions[index] = value;
      return newInclusions;
    });
  };

  const addInclusion = () => {
    setInclusions((prev) => [...prev, '']);
  };

  const removeInclusion = (index) => {
    setInclusions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAwardChange = (index, value) => {
    setAwards((prev) => {
      const newAwards = [...prev];
      newAwards[index] = value;
      return newAwards;
    });
  };

  const addAward = () => {
    setAwards((prev) => [...prev, '']);
  };

  const removeAward = (index) => {
    setAwards((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePortfolioImages = async (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    const compressedFiles = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            new Compressor(file, {
              quality: 0.8,
              maxWidth: 1200,
              maxHeight: 800,
              convertSize: 1000000,
              success: resolve,
              error: reject,
            });
          })
      )
    );
    setPortfolioImages(compressedFiles);
  };

  const handleThumbnail = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await new Promise((resolve, reject) => {
          new Compressor(file, {
            quality: 0.8,
            maxWidth: 1200,
            maxHeight: 800,
            convertSize: 1000000,
            success: resolve,
            error: reject,
          });
        });
        setThumbnail(compressedFile);
      } catch (error) {
        console.error('Error processing thumbnail:', error);
      }
    }
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  const handleProfileImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await new Promise((resolve, reject) => {
          new Compressor(file, {
            quality: 0.8,
            maxWidth: 1200,
            maxHeight: 800,
            convertSize: 1000000,
            success: resolve,
            error: reject,
          });
        });
        setProfileImage(compressedFile);
      } catch (error) {
        console.error('Error processing profile image:', error);
      }
    }
  };

  const removePortfolioImage = (fileName) => {
    setPortfolioImages((prev) => prev.filter((file) => file.name !== fileName));
    const dt = new DataTransfer();
    portfolioImages
      .filter((file) => file.name !== fileName)
      .forEach((file) => dt.items.add(file));
    portfolioInputRef.current.files = dt.files;
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    thumbInputRef.current.value = '';
  };

  const removeVideo = () => {
    setVideo(null);
    videoInputRef.current.value = '';
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    profileInputRef.current.value = '';
  };

  const validateForm = () => {
    const requiredFields = [
      { id: 'name', label: 'Artist Name' },
      { id: 'location', label: 'Location' },
      { id: 'specialization', label: 'Specialization' },
      { id: 'type', label: 'Artist Type' },
      { id: 'minPrice', label: 'Starting Price' },
      { id: 'description', label: 'Short Description' },
      { id: 'detailedDescription', label: 'About This Artist' },
      { id: 'contactPhone', label: 'Phone Number' },
      { id: 'contactEmail', label: 'Email' },
      { id: 'address', label: 'Address' },
    ];

    for (const field of requiredFields) {
      if (field.id === 'specialization') {
        if (!formData.specialization.length) {
          alert(`Please select at least one ${field.label}`);
          return false;
        }
      } else if (!formData[field.id].trim()) {
        alert(`Please fill in ${field.label}`);
        document.getElementById(`artist-${field.id}`).focus();
        return false;
      }
    }

    if (!portfolioImages.length) {
      alert('Please upload at least one portfolio image');
      return false;
    }

    if (!thumbnail) {
      alert('Please upload a thumbnail image');
      return false;
    }

    if (!profileImage) {
      alert('Please upload a profile image');
      return false;
    }

    let hasServiceError = false;
    services.forEach((service) => {
      if (!service.name.trim() || !service.price.trim()) {
        hasServiceError = true;
      }
    });

    if (hasServiceError) {
      alert('Please fill in all required service fields (name and price)');
      return false;
    }

    return true;
  };

  const saveArtist = async () => {
    if (!validateForm()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'specialization' || key === 'inclusions' || key === 'awards' || key === 'highlights') {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });

    data.append('services', JSON.stringify(services));
    data.append('inclusions', JSON.stringify(inclusions.filter((inc) => inc.trim())));
    data.append('awards', JSON.stringify(awards.filter((award) => award.trim())));

    portfolioImages.forEach((image) => data.append('portfolioImages', image));
    if (thumbnail) data.append('thumbnail', thumbnail);
    if (video) data.append('video', video);
    if (profileImage) data.append('profileImage', profileImage);

    try {
      await axios.post('/api/artists', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Artist saved successfully!');
      window.location.href = '/admin/artists';
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save artist: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteArtist = async () => {
    if (window.confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
      try {
        await axios.delete('/api/artists/mock-artist-id');
        alert('Artist deleted successfully!');
        window.location.href = '/admin/artists';
      } catch (error) {
        console.error('Error deleting artist:', error);
        alert('Failed to delete artist: ' + error.message);
      }
    }
  };

  const cancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      window.location.href = '/admin/artists';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('highlight');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('highlight');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('highlight');
    handlePortfolioImages(e);
  };

  useEffect(() => {
    if (services.length === 0) addService();
    if (inclusions.length === 0) addInclusion();
    if (awards.length === 0) addAward();

    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationDropdownOpen(false);
        setSearchQuery('');
      }
      if (specializationRef.current && !specializationRef.current.contains(e.target)) {
        setSpecializationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    const previewButtons = document.querySelectorAll('.preview-btn');
    const scrollToPreview = () => {
      document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth' });
    };
    previewButtons.forEach((btn) => btn.addEventListener('click', scrollToPreview));

    if (locationDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      previewButtons.forEach((btn) => btn.removeEventListener('click', scrollToPreview));
    };
  }, [locationDropdownOpen]);

  const handleKeyDown = (e, option) => {
    if (e.key === 'Enter') {
      handleLocationSelect(option.value);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Artist Details</h2>
        <div>
          <button className="btn btn-danger" onClick={deleteArtist}>
            <i className="fas fa-trash"></i> Delete Artist
          </button>
          <button className="btn btn-outline preview-btn">
            <i className="fas fa-eye"></i> Preview
          </button>
          <button className="btn btn-primary" onClick={saveArtist} id="saveArtistBtn">
            <i className="fas fa-save"></i> Save Artist
          </button>
          <button className="btn btn-outline" onClick={() => (window.location.href = '/admin/artists')}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>
      </div>

      <div className="form-card">
        <h3 className="section-title">
          <i className="fas fa-info-circle"></i> Basic Information
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Artist Name*</label>
            <input
              type="text"
              className="form-control"
              id="artist-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Location*</label>
            <div className="custom-dropdown" ref={locationRef}>
              <input type="hidden" name="location" value={formData.location} />
              <div
                className="dropdown-display"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                role="combobox"
                aria-expanded={locationDropdownOpen}
                aria-controls="location-menu"
              >
                <span className="default-text">
                  {locationOptions.find((opt) => opt.value === formData.location)?.text || 'Select Location'}
                </span>
                <i className="fas fa-chevron-down dropdown-icon"></i>
              </div>
              {locationDropdownOpen && (
                <div className="dropdown-menu" id="location-menu">
                  <input
                    type="text"
                    className="dropdown-search"
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    ref={searchInputRef}
                    aria-label="Search locations"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-controls="location-options"
                  />
                  <div id="location-options">
                    {filteredLocationOptions.length > 0 ? (
                      filteredLocationOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`dropdown-item ${formData.location === option.value ? 'selected' : ''}`}
                          onClick={() => handleLocationSelect(option.value)}
                          onKeyDown={(e) => handleKeyDown(e, option)}
                          tabIndex={0}
                          role="option"
                          aria-selected={formData.location === option.value}
                        >
                          {option.text}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-item no-results">No results found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Specialization*</label>
            <div className="custom-dropdown multi-select" ref={specializationRef}>
              <input type="hidden" name="specialization" value={formData.specialization.join(',')} />
              <div
                className="dropdown-display"
                onClick={() => setSpecializationDropdownOpen(!specializationDropdownOpen)}
                role="combobox"
                aria-expanded={specializationDropdownOpen}
                aria-controls="specialization-menu"
              >
                <div className="selected-tags">
                  {formData.specialization.length > 0 ? (
                    formData.specialization.map((spec) => (
                      <span key={spec} className="tag">
                        {spec}
                        <i
                          className="fas fa-times"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpecializationToggle(spec);
                          }}
                          aria-label={`Remove ${spec}`}
                        ></i>
                      </span>
                    ))
                  ) : (
                    <span className="default-text">Select Specialization</span>
                  )}
                </div>
                <i className="fas fa-chevron-down dropdown-icon"></i>
              </div>
              {specializationDropdownOpen && (
                <div className="dropdown-menu" id="specialization-menu">
                  {specializationOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`dropdown-item ${formData.specialization.includes(option.value) ? 'selected' : ''}`}
                      onClick={() => handleSpecializationToggle(option.value)}
                      tabIndex={0}
                      role="option"
                      aria-selected={formData.specialization.includes(option.value)}
                    >
                      {option.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Artist Type*</label>
            <select
              className="form-control"
              id="artist-type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Starting Price (₹)*</label>
            <input
              type="number"
              className="form-control"
              id="min-price"
              name="minPrice"
              value={formData.minPrice}
              onChange={handleInputChange}
            />
          </div>
          
        </div>
        <div className="form-group">
          <label>Short Description*</label>
          <textarea
            className="form-control"
            id="artist-description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              id="featured-checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
            />
            Mark as Featured Artist
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="checkbox"
              id="best-month-checkbox"
              name="bestOfMonth"
              checked={formData.bestOfMonth}
              onChange={handleInputChange}
            />
            Mark as Best of the Month
          </label>
        </div>
      </div>

      <div className="form-card">
        <h3 className="section-title">
          <i className="fas fa-image"></i> Media
        </h3>
        <div className="form-group">
          <label>Portfolio Images (Gallery)*</label>
          <div
            className="image-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => portfolioInputRef.current.click()}
          >
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Drag & drop images here or click to browse</p>
            <p>Recommended: 5-10 high quality images (1200x800px)</p>
            <input
              type="file"
              id="portfolioImagesInput"
              ref={portfolioInputRef}
              multiple
              accept="image/*"
              onChange={handlePortfolioImages}
              style={{ display: 'none' }}
            />
          </div>
          <div className="preview-grid" id="portfolioImagesPreview">
            {portfolioImages.map((file) => (
              <div className="preview-item" key={file.name}>
                <img src={URL.createObjectURL(file)} alt="Preview" />
                <button
                  className="remove-btn"
                  onClick={() => removePortfolioImage(file.name)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Thumbnail Image*</label>
          <div
            className="image-upload"
            onClick={() => thumbInputRef.current.click()}
          >
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Click to upload thumbnail</p>
            <input
              type="file"
              id="thumbnailInput"
              ref={thumbInputRef}
              accept="image/*"
              onChange={handleThumbnail}
              style={{ display: 'none' }}
            />
          </div>
          <div className="preview-single" id="thumbnailPreview">
            {thumbnail && (
              <div className="preview-item">
                <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail Preview" />
                <button className="remove-btn" onClick={removeThumbnail}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label>Portfolio Video</label>
          <div
            className="image-upload"
            onClick={() => videoInputRef.current.click()}
          >
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Click to upload portfolio video</p>
            <input
              type="file"
              id="videoInput"
              ref={videoInputRef}
              accept="video/*"
              onChange={handleVideo}
              style={{ display: 'none' }}
            />
          </div>
          <div id="videoPreview">
            {video && (
              <div>
                <video controls style={{ maxWidth: '100%', marginTop: '15px' }}>
                  <source src={URL.createObjectURL(video)} type={video.type} />
                  Your browser does not support the video tag.
                </video>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={removeVideo}
                  style={{ marginTop: '10px' }}
                >
                  <i className="fas fa-trash"></i> Remove Video
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label>Profile Image*</label>
          <div
            className="image-upload"
            onClick={() => profileInputRef.current.click()}
          >
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Click to upload profile image</p>
            <input
              type="file"
              id="profileImageInput"
              ref={profileInputRef}
              accept="image/*"
              onChange={handleProfileImage}
              style={{ display: 'none' }}
            />
          </div>
          <div className="preview-single" id="profileImagePreview">
            {profileImage && (
              <div className="preview-item">
                <img src={URL.createObjectURL(profileImage)} alt="Profile Preview" />
                <button className="remove-btn" onClick={removeProfileImage}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-card">
        <h3 className="section-title">
          <i className="fas fa-book"></i> Detailed Information
        </h3>
        <div className="form-group">
          <label>About This Artist*</label>
          <textarea
            className="form-control"
            id="detailed-description"
            name="detailedDescription"
            value={formData.detailedDescription}
            onChange={handleInputChange}
            rows="6"
          />
        </div>
        <div className="form-group">
          <label>Highlights</label>
          {[...Array(4)].map((_, index) => (
            <input
              key={index}
              type="text"
              className="form-control highlight-input"
              name={`highlight-${index}`}
              placeholder={`Highlight ${index + 1}`}
              onChange={(e) => {
                const highlights = formData.highlights || ['', '', '', ''];
                highlights[index] = e.target.value;
                setFormData((prev) => ({ ...prev, highlights }));
              }}
              value={(formData.highlights || ['', '', '', ''])[index] || ''}
              style={{ marginBottom: '10px' }}
            />
          ))}
        </div>
      </div>

      <div className="form-card">
        <h3 className="section-title">
          <i className="fas fa-list"></i> Services & Packages
        </h3>
        <div id="servicesContainer">
          {services.map((service) => (
            <div className="service-item" key={service.id} data-service-id={service.id}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Service Name*</label>
                  <input
                    type="text"
                    className="form-control service-name"
                    value={service.name}
                    onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                    placeholder="Bridal Makeup"
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹)*</label>
                  <input
                    type="number"
                    className="form-control service-price"
                    value={service.price}
                    onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)}
                    placeholder="15000"
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    className="form-control service-duration"
                    value={service.duration}
                    onChange={(e) => handleServiceChange(service.id, 'duration', e.target.value)}
                    placeholder="2-3 hours"
                  />
                </div>
                <div className="form-group">
                  <button
                    className="btn btn-danger remove-service-btn"
                    onClick={() => removeService(service.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control service-description"
                  value={service.description}
                  onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                  rows="2"
                  placeholder="Service description"
                />
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" id="addServiceBtn" onClick={addService}>
          Add Another Service
        </button>
        <div className="form-group">
          <label>Package Name</label>
          <input
            type="text"
            className="form-control"
            id="package-name"
            name="packageName"
            value={formData.packageName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Package Price (₹)</label>
          <input
            type="number"
            className="form-control"
            id="package-price"
            name="packagePrice"
            value={formData.packagePrice}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Package Description</label>
          <textarea
            className="form-control"
            id="package-description"
            name="packageDescription"
            value={formData.packageDescription}
            onChange={handleInputChange}
            rows="4"
          />
        </div>
        <div className="form-group">
          <label>Package Inclusions</label>
          <div id="packageInclusionsContainer">
            {inclusions.map((inclusion, index) => (
              <div className="inclusion-item" key={index}>
                <input
                  type="text"
                  className="form-control inclusion-input"
                  value={inclusion}
                  onChange={(e) => handleInclusionChange(index, e.target.value)}
                  placeholder="Inclusion"
                />
                <button
                  className="btn btn-danger btn-sm remove-inclusion-btn"
                  onClick={() => removeInclusion(index)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" id="addInclusionBtn" onClick={addInclusion}>
            Add Inclusion
          </button>
        </div>
      </div>

      <div className="form-card">
        <h3 className="section-title">
          <i className="fas fa-trophy"></i> Stats & Achievements
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Years Experience</label>
            <input
              type="number"
              className="form-control"
              id="years-exp"
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Happy Clients</label>
            <input
              type="number"
              className="form-control"
              id="happy-clients"
              name="happyClients"
              value={formData.happyClients}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Premium Products</label>
            <input
              type="number"
              className="form-control"
              id="premium-products"
              name="premiumProducts"
              value={formData.premiumProducts}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Completed Looks</label>
            <input
              type="number"
              className="form-control"
              id="completed-looks"
              name="completedLooks"
              value={formData.completedLooks}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Awards & Recognitions</label>
          <div id="awardsContainer">
            {awards.map((award, index) => (
              <div className="award-item" key={index}>
                <input
                  type="text"
                  className="form-control award-input"
                  value={award}
                  onChange={(e) => handleAwardChange(index, e.target.value)}
                  placeholder="Award"
                />
                <button
                  className="btn btn-danger btn-sm remove-award-btn"
                  onClick={() => removeAward(index)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" id="addAwardBtn" onClick={addAward}>
            Add Award
          </button>
        </div>
      </div>

      <div className="form-card">
        <h3 className="section-title">
          <i className="fas fa-phone"></i> Contact Information
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Phone Number*</label>
            <input
              type="text"
              className="form-control"
              id="contact-phone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              className="form-control"
              id="contact-email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Address*</label>
            <input
              type="text"
              className="form-control"
              id="contact-address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Working Hours</label>
            <input
              type="text"
              className="form-control"
              id="working-hours"
              name="workingHours"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Social Media Links</label>
          <input
            type="text"
            className="form-control"
            id="whatsapp-link"
            name="whatsappLink"
            value={formData.whatsappLink}
            onChange={handleInputChange}
            placeholder="WhatsApp"
            style={{ marginBottom: '10px' }}
          />
          <input
            type="text"
            className="form-control"
            id="instagram-link"
            name="instagramLink"
            value={formData.instagramLink}
            onChange={handleInputChange}
            placeholder="Instagram"
            style={{ marginBottom: '10px' }}
          />
          <input
            type="text"
            className="form-control"
            id="facebook-link"
            name="facebookLink"
            value={formData.facebookLink}
            onChange={handleInputChange}
            placeholder="Facebook"
          />
        </div>
      </div>

      <div className="form-header">
        <button className="btn btn-outline" id="cancelBtn" onClick={cancel}>
          Cancel
        </button>
        <div>
          <button className="btn btn-outline preview-btn" id="previewBtnBottom">
            <i className="fas fa-eye"></i> Preview
          </button>
          <button className="btn btn-primary" id="saveArtistBtnBottom" onClick={saveArtist}>
            <i className="fas fa-save"></i> Save Artist
          </button>
        </div>
      </div>

      <div className="preview-section" id="previewSection">
        <h2 className="preview-title">Artist Preview</h2>
        <div className="preview-tabs">
          <div
            className={`preview-tab ${previewTab === 'listing' ? 'active' : ''}`}
            onClick={() => setPreviewTab('listing')}
            data-tab="listing"
          >
            Listing View
          </div>
          <div
            className={`preview-tab ${previewTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setPreviewTab('portfolio')}
            data-tab="portfolio"
          >
            Portfolio View
          </div>
        </div>
        <div
          id="listingPreview"
          className={`preview-tab-content ${previewTab === 'listing' ? 'active' : ''}`}
        >
          <div className="preview-card">
            {thumbnail && <img id="previewThumbnail" src={URL.createObjectURL(thumbnail)} alt="Artist Thumbnail" />}
            <div className="preview-card-body">
              <h5 className="preview-card-title" id="previewName">
                {formData.name || 'Artist Name'}
              </h5>
              <p className="preview-card-text" id="previewSpecialization">
                <i className="fas fa-paint-brush"></i>{' '}
                {formData.specialization.length
                  ? formData.specialization.join(', ')
                  : 'Specialization'}
              </p>
              <p className="preview-card-text" id="previewLocation">
                <i className="fas fa-map-marker-alt"></i>{' '}
                {formData.location || 'Location'}
              </p>
              <p className="preview-card-text" id="previewPrice">
                <i className="fas fa-rupee-sign"></i> ₹
                {formData.minPrice
                  ? parseInt(formData.minPrice).toLocaleString('en-IN')
                  : '5,000'}{' '}
                onwards
              </p>
              <p className="preview-card-text" id="previewDescription">
                {formData.description || 'No description provided'}
              </p>
            </div>
          </div>
        </div>
        <div
          id="portfolioPreview"
          className={`preview-tab-content ${previewTab === 'portfolio' ? 'active' : ''}`}
        >
          <div className="preview-top-section">
            <h1>Famiory</h1>
            <h2>Beauty Redefined</h2>
            <div className="artist-name-preview" id="previewDetailName">
              {formData.name || 'Sarah Johnson'} |{' '}
              {formData.specialization.length
                ? formData.specialization.join(', ')
                : 'Makeup & Hairstyling'}
            </div>
          </div>
          <div className="preview-details-section">
            <div className="preview-profile-column">
              {profileImage && (
                <img
                  id="previewProfileImage"
                  src={URL.createObjectURL(profileImage)}
                  alt="Artist Profile"
                />
              )}
            </div>
            <div className="preview-about-column">
              <h3>
                <span>About Me</span>
              </h3>
              <p id="previewAbout">
                {formData.detailedDescription || 'No detailed description provided'}
              </p>
            </div>
          </div>
          <div className="preview-details-section">
            <div className="preview-services-column">
              <h3>
                <span>Services Offered</span>
              </h3>
              <div id="previewServices">
                {services.map((service) => (
                  <div className="service-row" key={service.id}>
                    <span className="service-name">
                      {service.name || 'Unnamed Service'}
                    </span>
                    <span className="service-price">
                      Rs. {service.price || '0'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="preview-package-column">
              <h3>
                <span>{formData.packageName || 'Package'}</span>
              </h3>
              <div id="previewPackage">
                <div className="package-header">
                  <h4 id="previewPackageName">
                    {formData.packageName || 'Bridal Package'}
                  </h4>
                  <span id="previewPackagePrice">
                    {formData.packagePrice || 'Price On Request'}
                  </span>
                </div>
                <p id="previewPackageDescription">
                  {formData.packageDescription || 'Package description will appear here'}
                </p>
                <ul id="previewPackageInclusions">
                  {inclusions.filter((inc) => inc.trim()).length > 0 ? (
                    inclusions
                      .filter((inc) => inc.trim())
                      .map((inclusion, index) => (
                        <li key={index}>{inclusion}</li>
                      ))
                  ) : (
                    <li>No inclusions specified</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="preview-details-section">
            <h3>
              <span>My Work Reel</span>
            </h3>
            <div id="previewVideo">
              {video ? (
                <video controls style={{ maxWidth: '100%', borderRadius: '8px' }}>
                  <source src={URL.createObjectURL(video)} type={video.type} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>Video will appear here</p>
              )}
            </div>
          </div>
          <div className="preview-details-section">
            <h3>
              <span>My Portfolio</span>
            </h3>
            <div id="previewGallery">
              {portfolioImages.slice(0, 3).map((file, index) => (
                <div
                  key={index}
                  style={{
                    background: `url(${URL.createObjectURL(file)}) center/cover`,
                    height: '200px',
                  }}
                />
              ))}
              {portfolioImages.length === 0 && (
                <>
                  <div style={{ background: '#eee', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Image 1
                  </div>
                  <div style={{ background: '#eee', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Image 2
                  </div>
                  <div style={{ background: '#eee', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Image 3
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="preview-stats-section">
            <h3>
              <span>Why Choose Me?</span>
            </h3>
            <div id="previewStats">
              <div>
                <div id="previewYearsExp">{formData.yearsExperience || '0+'}</div>
                <div>Years Experience</div>
              </div>
              <div>
                <div id="previewHappyClients">{formData.happyClients || '0+'}</div>
                <div>Happy Clients</div>
              </div>
              <div>
                <div id="previewPremiumProducts">{formData.premiumProducts || '0%'}</div>
                <div>Premium Products</div>
              </div>
              <div>
                <div id="previewCompletedLooks">{formData.completedLooks || '0+'}</div>
                <div>Completed Looks</div>
              </div>
            </div>
          </div>
          <div className="preview-contact-section">
            <h3>
              <span>Book Your Appointment</span>
            </h3>
            <div id="previewContact">
              <div>
                <div>
                  <i className="fas fa-phone"></i>
                  <span id="previewContactPhone">
                    {formData.contactPhone || 'Not specified'}
                  </span>
                </div>
                <div>
                  <i className="fas fa-envelope"></i>
                  <span id="previewContactEmail">
                    {formData.contactEmail || 'Not specified'}
                  </span>
                </div>
              </div>
              <div>
                <div>
                  <i className="fas fa-map-marker-alt"></i>
                  <span id="previewContactAddress">
                    {formData.address || 'Not specified'}
                  </span>
                </div>
                <div>
                  <i className="fas fa-clock"></i>
                  <span id="previewWorkingHours">
                    {formData.workingHours || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
            <div id="previewSocial">
              {formData.instagramLink && (
                <a href={formData.instagramLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {formData.facebookLink && (
                <a href={formData.facebookLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {formData.whatsappLink && (
                <a href={formData.whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
            </div>
            <a href="#" className="appointment-btn">
              <i className="fas fa-calendar-check"></i> Book Appointment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistAdmin;