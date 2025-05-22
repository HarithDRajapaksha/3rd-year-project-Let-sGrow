import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './investorProfile.css';
import NavigationBar from '../../../Components/navigation/NavigationBar';

export default function StartupProfile(userImageUrl) {
  const [imageError, setImageError] = useState(false);
  const { id } = useParams(); 
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();
  const [profileOwner, setProfileOwner] = useState({});

  const handleImageError = () => setImageError(true);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/api/profile/${id}`) 
        .then((response) => {
          setProfileData(response.data);
          setIsLoading(false); 
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
          setIsLoading(false); 
        });
    } else {
      console.error("Startup ID is missing");
      setIsLoading(false); 
    }
  }, [id]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
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
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!profileData) {
    return <div>Startup profile not found.</div>; 
  }

  return (
    <div className="startup-profile-page">
      {/* Navigation Bar */}
      <div className="navbar-container">
        <NavigationBar profileOwner={profileOwner} /> 
      </div>

      {/* Profile Content */}
      <div className="startup-profile-view">
        <div className="profile-header-view">
          <img
            src={
              imageError || !profileData?.profile_image
                ? '/defaulProfile.png' 
                : profileData.profile_image.startsWith("/uploads/")
                  ? `http://localhost:3000${profileData.profile_image}`
                  : profileData.profile_image
            }
            alt="Profile"
            className="profile-image-view"
            onError={handleImageError}
          />
          <h1>{profileData.first_name || 'N/A'} {profileData.last_name || ''}</h1>
          <p>Joined on: {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className="profile-details-view">
          <h2>About</h2>
          <table className="profile-table-view">
            <tbody>
              <tr>
                <th>First Name</th>
                <td>{profileData.first_name || 'N/A'}</td>
              </tr>
              <tr>
                <th>Last Name</th>
                <td>{profileData.last_name || 'N/A'}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>{profileData.phone_number || 'N/A'}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>{profileData.address || 'N/A'}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{profileData.email || 'N/A'}</td>
              </tr>
              <tr>
                <th>Role</th>
                <td>{profileData.role || 'N/A'}</td>
              </tr>
              <tr>
                <th>Categories</th>
                <td>{profileData.categories || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}