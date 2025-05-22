import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './startupDashboard.css';
import axios from 'axios';
import NavigationBar from '../../../Components/navigation/NavigationBar';

const StartupDashboard = ({ userImageUrl }) => {
  const [imageError, setImageError] = useState(false);
  const [investors, setInvestors] = useState([]);
  const [profileOwner, setProfileOwner] = useState({});
  const [gigs, setGigs] = useState([]);
  const [searchCategory, setSearchCategory] = useState('');
  const navigate = useNavigate();

  // Get userId from localStorage or profileOwner
  const userId = localStorage.getItem("userId") || profileOwner?.id || 1;
  console.log("User ID:", userId);

  const handleImageError = () => setImageError(true);

  const handleAddGig = () => navigate('/create-new-gig');

  // View gig handler
  const handleViewGig = (gigId) => {
    navigate(`/gig-view/${gigId}`);
  };

  // View investor profile handler
  const handleInvestorClick = (investor) => {
    // Make sure investor has an id property
    navigate(`/investor-profile/${investor.id}`);
  };

  // Fetch profile owner and investors on mount
  useEffect(() => {
    axios.get('http://localhost:3000/api/investors')
      .then(response => setInvestors(response.data))
      .catch(error => console.error('Error fetching investors:', error));
  }, []);

  // Fetch gigs for the user when userId changes or after gig creation
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

  //Fetch gigs for the user when userId changes or after gig creation
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3000/api/gigs/${userId}`)
        .then(response => setGigs(response.data))
        .catch(error => console.error('Error fetching gigs:', error));
    }
  }, [userId]);

  // Determine which category to filter by: search input or profileOwner's category
  const filterCategory = searchCategory.trim()
    ? searchCategory.trim().toLowerCase()
    : (profileOwner.categories ? profileOwner.categories.trim().toLowerCase() : '');

  const filteredInvestors = investors.filter(
    investor =>
      investor.categories &&
      filterCategory &&
      investor.categories.trim().toLowerCase() === filterCategory
  );

  return (
    <div className="startup-dashboard">
      <div className="navbar-container">
        <NavigationBar profileOwner={profileOwner} /> 
      </div>
      {/* Right section */}
      <div className="startup-dashboard-right-section">
        <div className="startup-dashboard-right-section-content1">
          <input
            className="startup-search-bar"
            type="text"
            placeholder="Search Investors by CATEGORIES"
            value={searchCategory}
            onChange={e => setSearchCategory(e.target.value)}
          />
        </div>
        <div className="startup-dashboard-right-section-content2">
          <h3>Investors</h3>
          <div className="investors-list">
            {filteredInvestors.length > 0 ? (
              filteredInvestors.map((investor, index) => (
                <div
                  key={investor.id || index}
                  className="investors-list-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleInvestorClick(investor)}
                >
                  <div className="investors-list-item-image">
                    <img
                      src={imageError || !userImageUrl ? 'defaulProfile.png' : userImageUrl}
                      alt=""
                      className="profile-image"
                      onError={handleImageError}
                    />
                  </div>
                  <h6 className='startup-investor-name'>{investor.name}</h6>
                </div>
              ))
            ) : (
              <div style={{ color: "#888", padding: "1rem" }}>
                No investors found in this category.
              </div>
            )}
          </div>
        </div>
                <div className="startup-dashboard-right-section-content3">
          <div className="startup-profile-icon-name-date">
            <div className="investors-list-item-image">
              <img
                src={
                  imageError || !profileOwner.profile_image
                    ? 'defaulProfile.png'
                    : profileOwner.profile_image.startsWith("/uploads/")
                      ? `http://localhost:3000${profileOwner.profile_image}`
                      : profileOwner.profile_image
                }
                alt="Profile"
                className="profile-image"
                onError={handleImageError}
              />
            </div>
            <div className="startup-profile-details">
              <div className="startup-profile-icon-name-date">
                <h6 className="startup-investor-name">{profileOwner.first_name || 'N/A'}</h6>
                <h6 className="startup-investor-date">
                  {profileOwner.date ? new Date(profileOwner.date).toLocaleDateString() : 'N/A'}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="empty-gig-container-startup-dashboard">
          {gigs.length === 0 ? (
            <div className="empty-gig-content-startup-dashboard">
              <h2>No Gigs Yet</h2>
              <p>Start by creating your first gig to showcase your startup proposal.</p>
              <button className="add-gig-button-startup-dashboard" onClick={handleAddGig}>
                Add New Gig
              </button>
            </div>
          ) : (
            <div className="gig-list">
              <div>
                <h2>Your Gigs</h2>
                <button className="add-gig-button-startup-dashboard" onClick={handleAddGig}>
                  Add New Gig
                </button>
              </div>
              {gigs.map(gig => (
                <div key={gig.id} className="gig-card">
                  {gig.image_path && (
                    <img
                      src={
                        gig.image_path.startsWith("/uploads/")
                          ? `http://localhost:3000${gig.image_path}`
                          : gig.image_path
                      }
                      alt="Gig"
                      width={100}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                  )}
                  <h3>{gig.startup_name}</h3>
                  <button
                    className="view-gig-button"
                    onClick={() => handleViewGig(gig.id)}
                  >
                    View Gig
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupDashboard;