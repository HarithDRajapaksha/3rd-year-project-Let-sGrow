import React, { useState, useEffect } from "react";
import "./profileSettings.css";
import {
  FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaTags,
  FaMoneyBillWave, FaImage, FaEdit, FaCheck, FaTimes, FaPlus, FaSave
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../../Components/navigation/NavigationBar'; 
import axios from 'axios';

const API_URL = "http://localhost:3000/api";

const ProfileSettings = () => {

  const userId = localStorage.getItem("userId") || profileOwner?.id || 1;
  console.log("User ID:", userId);
  const [profileOwner, setProfileOwner] = useState({});

  useEffect(() => {
        if (userId) {
          axios
            .get(`http://localhost:3000/api/profile-owner/${userId}`)
            .then((response) => setProfileOwner(response.data))
            .catch((error) => {
              console.error('Error fetching profile owner:', error);
              setProfileOwner(null); 
            });
        } else {
          console.error('User ID is missing');
          setProfileOwner(null); 
        }
      }, [userId]);

  const [isEditing, setIsEditing] = useState({
    category: false,
    email: false,
    address: false,
    priceRange: false
  });

  const [values, setValues] = useState({
    name: "",
    category: "",
    priceRange: "",
    email: "",
    address: "",
    contactNumbers: [""],
    profilePicture: ""
  });

  const [tempValues, setTempValues] = useState({
    category: "",
    priceRange: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const categories = [
    "Agriculture",
    "Health",
    "Education",
    "Technology",
    "Finance",
    "Real Estate",
    "Retail",
    "Manufacturing",
    "Transportation",
    "Energy",
    "Telecommunications",
    "Entertainment",
    "Tourism",
    "Food and Beverage",
    "Construction"
  ];
  
  const priceRanges = [
    "$10,000-$20,000",
    "$20,000-$50,000",
    "$50,000-$100,000",
    "$100,000-$250,000",
    "$250,000-$500,000",
    "$500,000-$1,000,000",
    "Above $1,000,000"
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setValues({
          name: data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : data.name || "",
          category: data.categories || data.category || "",
          priceRange: data.price_range || data.priceRange || "",
          email: data.email || "",
          address: data.address || "",
          contactNumbers: data.phone_number
            ? Array.isArray(data.phone_number)
              ? data.phone_number
              : typeof data.phone_number === "string"
                ? data.phone_number.split(",").map(s => s.trim())
                : [""]
            : [""],
          profilePicture: data.profile_image || data.profilePicture || ""
        });
        setTempValues({
          category: data.categories || data.category || "",
          priceRange: data.price_range || data.priceRange || ""
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  // Save a single field (for inline edit)
  const handleSave = async (field) => {
    await handleSaveAll();
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  // Save all fields (for Save All button)
    const handleSaveAll = async () => {
    try {
      const formData = new FormData();
      const fileInput = document.getElementById('profilePicture');
      if (fileInput?.files[0]) {
        formData.append('profile_image', fileInput.files[0]);
      }
  
      // Use tempValues for fields that are being edited, otherwise use values
      const updatedValues = {
        ...values,
        ...tempValues
      };
  
      formData.append('phone_number', updatedValues.contactNumbers.join(','));
      formData.append('categories', updatedValues.category);
      formData.append('price_range', updatedValues.priceRange);
      formData.append('email', updatedValues.email);
      formData.append('address', updatedValues.address);
  
      // If backend expects first_name and last_name, split name
      if (updatedValues.name) {
        const [first_name, ...rest] = updatedValues.name.split(" ");
        formData.append('first_name', first_name);
        formData.append('last_name', rest.join(" "));
      }
  
      // Append password if it exists in tempValues
      if (tempValues.password) {
        formData.append('password', tempValues.password);
      }
  
      const response = await fetch(`${API_URL}/profile/${localStorage.getItem('userId')}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
  
      if (!response.ok) throw new Error('Update failed');
      setValues(updatedValues);
      setIsEditing({
        category: false,
        email: false,
        address: false,
        priceRange: false
      });
      window.alert('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      window.alert(`Error: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    }
  };

const handleDeleteProfile = async () => {
  if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
    try {
      const response = await fetch(`${API_URL}/profile/${localStorage.getItem("userId")}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete profile");

      window.alert("Profile deleted successfully.");
      localStorage.clear(); // Clear user data from localStorage
      navigate("/"); // Redirect to the homepage or login page
    } catch (error) {
      window.alert(`Error: ${error.message}`);
    }
  }
};

  const handleCancel = (field) => {
    setTempValues((prev) => ({ ...prev, [field]: values[field] }));
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleChange = (e, field) => {
    setTempValues({ ...tempValues, [field]: e.target.value });
  };

  const handleContactChange = (index, value) => {
    const updatedContacts = Array.isArray(values.contactNumbers) ? [...values.contactNumbers] : [];
    updatedContacts[index] = value;
    setValues({ ...values, contactNumbers: updatedContacts });
  };

  const addNewContact = () => {
    setValues({ ...values, contactNumbers: [...(Array.isArray(values.contactNumbers) ? values.contactNumbers : []), ""] });
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="profile-settings-page">
      {/* Navigation Bar */}
      <div className="navbar-container">
        <NavigationBar profileOwner={profileOwner} /> 
      </div>

      {/* Profile Settings Content */}
      <div className="profile-settings-startup-profile-view">
        <div className="profile-settings">
          {success && <div className="profile-settings-success-message">{success}</div>}
          {error && <div className="profile-settings-error-message">{error}</div>}

          {/* Personal Details */}
          <section className="profile-settings-section">
            <h3>Personal Details</h3>
            <div className="profile-settings-item">
              <FaUser className="profile-settings-icon" />
              <span>{values.name}</span>
            </div>
            <div className="profile-settings-item">
              <FaImage className="profile-settings-icon" />
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setValues({
                      ...values,
                      profilePicture: URL.createObjectURL(e.target.files[0])
                    });
                  }
                }}
              />
              <button
                className="profile-settings-upload-button"
                onClick={() => document.getElementById('profilePicture').click()}
              >
                Upload New Photo
              </button>
              {values.profilePicture && (
                <img
                  src={
                    values.profilePicture.startsWith("blob:")
                      ? values.profilePicture
                      : values.profilePicture.startsWith("/uploads/")
                        ? `http://localhost:3000${values.profilePicture}`
                        : values.profilePicture
                  }
                  alt="Profile"
                  className="profile-settings-profile-preview"
                />
              )}
            </div>
            <div className="profile-settings-item">
              <FaEdit className="profile-settings-icon" />
              {isEditing.password ? (
                <>
                  <input
                    type="password"
                    value={tempValues.password || ""}
                    onChange={(e) => setTempValues({ ...tempValues, password: e.target.value })}
                    className="profile-settings-edit-input"
                    placeholder="Enter new password"
                  />
                  <FaCheck
                    className="profile-settings-save-icon"
                    onClick={() => handleSave("password")}
                  />
                  <FaTimes
                    className="profile-settings-cancel-icon"
                    onClick={() => handleCancel("password")}
                  />
                </>
              ) : (
                <>
                  <span>********</span>
                  <FaEdit
                    className="profile-settings-edit-icon"
                    onClick={() => handleEditClick("password")}
                  />
                </>
              )}
            </div>
          </section>

          {/* Contact Details */}
          <section className="profile-settings-section">
            <h3>Contact Details</h3>
            <div className="profile-settings-item">
              <FaPhone className="profile-settings-icon" />
              {Array.isArray(values.contactNumbers) && values.contactNumbers.map((number, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                  <input
                    type="text"
                    value={number}
                    onChange={e => handleContactChange(idx, e.target.value)}
                    className="profile-settings-edit-input"
                    placeholder="Enter contact number"
                  />
                </div>
              ))}
              <button type="button" onClick={addNewContact} className="profile-settings-add-contact-btn" style={{ marginTop: 6 }}>
                <FaPlus /> Add Contact
              </button>
            </div>
            <div className="profile-settings-item">
              <FaMapMarkerAlt className="profile-settings-icon" />
              {isEditing.address ? (
                <>
                  <input
                    type="text"
                    value={tempValues.address !== undefined ? tempValues.address : values.address}
                    onChange={(e) => setTempValues({ ...tempValues, address: e.target.value })}
                    className="profile-settings-edit-input"
                  />
                  <FaCheck
                    className="profile-settings-save-icon"
                    onClick={() => handleSave('address')}
                  />
                  <FaTimes
                    className="profile-settings-cancel-icon"
                    onClick={() => handleCancel('address')}
                  />
                </>
              ) : (
                <>
                  <span>{values.address}</span>
                  <FaEdit
                    className="profile-settings-edit-icon"
                    onClick={() => handleEditClick('address')}
                  />
                </>
              )}
            </div>
            <div className="profile-settings-item">
              <FaEnvelope className="profile-settings-icon" />
              {isEditing.email ? (
                <>
                  <input
                    type="email"
                    value={tempValues.email !== undefined ? tempValues.email : values.email}
                    onChange={(e) => setTempValues({ ...tempValues, email: e.target.value })}
                    className="profile-settings-edit-input"
                  />
                  <FaCheck
                    className="profile-settings-save-icon"
                    onClick={() => handleSave('email')}
                  />
                  <FaTimes
                    className="profile-settings-cancel-icon"
                    onClick={() => handleCancel('email')}
                  />
                </>
              ) : (
                <>
                  <span>{values.email}</span>
                  <FaEdit
                    className="profile-settings-edit-icon"
                    onClick={() => handleEditClick('email')}
                  />
                </>
              )}
            </div>
          </section>

          {/* Category */}
          <section className="profile-settings-section">
            <h3>Category</h3>
            <div className="profile-settings-item">
              <FaTags className="profile-settings-icon" />
              {isEditing.category ? (
                <>
                  <select
                    value={tempValues.category}
                    onChange={(e) => handleChange(e, "category")}
                    className="profile-settings-edit-dropdown"
                  >
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <FaCheck
                    className="profile-settings-save-icon"
                    onClick={() => handleSave("category")}
                  />
                  <FaTimes
                    className="profile-settings-cancel-icon"
                    onClick={() => handleCancel("category")}
                  />
                </>
              ) : (
                <>
                  <span>{values.category}</span>
                  <FaEdit
                    className="profile-settings-edit-icon"
                    onClick={() => handleEditClick("category")}
                  />
                </>
              )}
            </div>
          </section>

          {/* Price Range */}
          <section className="profile-settings-section">
            <h3>Pricing</h3>
            <div className="profile-settings-item">
              <FaMoneyBillWave className="profile-settings-icon" />
              {isEditing.priceRange ? (
                <>
                  <select
                    value={tempValues.priceRange}
                    onChange={(e) => handleChange(e, "priceRange")}
                    className="profile-settings-edit-dropdown"
                  >
                    {priceRanges.map((range, index) => (
                      <option key={index} value={range}>{range}</option>
                    ))}
                  </select>
                  <FaCheck
                    className="profile-settings-save-icon"
                    onClick={() => handleSave("priceRange")}
                  />
                  <FaTimes
                    className="profile-settings-cancel-icon"
                    onClick={() => handleCancel("priceRange")}
                  />
                </>
              ) : (
                <>
                  <span>{values.priceRange}</span>
                  <FaEdit
                    className="profile-settings-edit-icon"
                    onClick={() => handleEditClick("priceRange")}
                  />
                </>
              )}
            </div>
          </section>

          {/* Save All Button */}
          <div style={{ textAlign: "right", marginTop: 24 }}>
            <button
              className="profile-settings-delete-btn"
              style={{
                background: "#dc3545",
                color: "#fff",
                border: "none",
                padding: "10px 24px",
                borderRadius: 4,
                fontSize: 16,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginRight: 16,
              }}
              onClick={handleDeleteProfile}
            >
              <FaTimes /> Delete Profile
            </button>
            <button
              className="profile-settings-save-all-btn"
              style={{
                background: "#28a745",
                color: "#fff",
                border: "none",
                padding: "10px 24px",
                borderRadius: 4,
                fontSize: 16,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8
              }}
              onClick={handleSaveAll}
            >
              <FaSave /> Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;