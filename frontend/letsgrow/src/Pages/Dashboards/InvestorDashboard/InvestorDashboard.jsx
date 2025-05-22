import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './investorDashboard.css';
import axios from 'axios';
import NavigationBar from '../../../Components/navigation/NavigationBar';

const InvestorDashboard = ({ userImageUrl }) => {
  const [imageError, setImageError] = useState(false);
  const [startups, setStartups] = useState([]);
  const [profileOwner, setProfileOwner] = useState({});
  const [searchCategory, setSearchCategory] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState(null);
  const [blogCreated, setBlogCreated] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const [editingBlogId, setEditingBlogId] = useState(null);

  const [gigs, setGigs] = useState([]);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || profileOwner?.id || 1;

  const handleImageError = () => setImageError(true);
  const handleStartupClick = (startup) => navigate(`/startup-profile/${startup.id}`);

  // Fetch startups
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/startups');
        setStartups(response.data);
      } catch (error) {
        console.error('Error fetching startups:', error);
      }
    };
    fetchStartups();
  }, []);

  // Fetch profile owner
  useEffect(() => {
    (async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/profile-owner/${userId}`);
          setProfileOwner(response.data);
        } catch (error) {
          console.error('Error fetching profile owner:', error);
          setProfileOwner(null);
        }
      } else {
        console.error('User ID is missing');
        setProfileOwner(null);
      }
    })();
  }, [userId]);

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/blogs/${userId}`);
      setBlogs(response.data);
      setError('');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('No blogs found for this user.');
        setBlogs([]);
        setError('No blogs found for this user.');
      } else {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs.');
      }
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [userId, blogCreated]);

  // Fetch gigs by category
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/gigs-by-category/${userId}`);
        setGigs(response.data);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
    };
    fetchGigs();
  }, [userId]);

  // Filter startups by category
  const filterCategories = searchCategory.trim()
    ? searchCategory.trim().toLowerCase().split(',').map(cat => cat.trim())
    : (profileOwner.categories
        ? profileOwner.categories.trim().toLowerCase().split(',').map(cat => cat.trim())
        : []);

  const filteredStartups = startups.filter(startup => {
    if (!startup.categories || filterCategories.length === 0) return false;
    const startupCategories = startup.categories.trim().toLowerCase().split(',').map(cat => cat.trim());
    return startupCategories.some(cat => filterCategories.includes(cat));
  });

  // Handle blog creation
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("investorId", userId);
    formData.append("title", blogTitle);
    formData.append("content", blogContent);
    if (blogImage) formData.append("image", blogImage);

    try {
      await axios.post("http://localhost:3000/api/create-blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBlogTitle('');
      setBlogContent('');
      setBlogImage(null);
      setBlogCreated(true);
      setTimeout(() => setBlogCreated(false), 3000);
      fetchBlogs(); 
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  // Handle blog editing
  const handleEditBlog = (blog) => {
    setBlogTitle(blog.title);
    setBlogContent(blog.content);
    setBlogImage(null); 
    setEditingBlogId(blog.id); 
  };

  // Handle blog updating
  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", blogTitle);
    formData.append("content", blogContent);
    if (blogImage) formData.append("image", blogImage);

    try {
      await axios.put(`http://localhost:3000/api/blog/${editingBlogId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBlogTitle('');
      setBlogContent('');
      setBlogImage(null);
      setEditingBlogId(null);
      setBlogCreated(true);
      setTimeout(() => setBlogCreated(false), 3000);
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async (blogId) => {
    try {
      await axios.delete(`http://localhost:3000/api/blog/${blogId}`);
      fetchBlogs(); 
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="investor-dashboard">
      <div className="navbar-container">
        <NavigationBar profileOwner={profileOwner} />
      </div>

      <div className="investor-dashboard-right-section">
        {/* Search Section */}
        <div className="investor-dashboard-right-section-content1">
          <input
            className="investor-search-bar"
            type="text"
            placeholder="Search Startups by CATEGORIES"
            value={searchCategory}
            onChange={e => setSearchCategory(e.target.value)}
          />
        </div>

        {/* Startups Section */}
        <div className="investor-dashboard-right-section-content2">
          <h3>Startups</h3>
          <div className="startups-list">
            {filteredStartups && filteredStartups.length > 0 ? (
              filteredStartups.map((startup) => (
                <div
                  key={startup.id}
                  className="startups-list-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleStartupClick(startup)}
                >
                  <div className="startups-list-item-image">
                    <div className="investors-list-item-image">
                      <img
                        src={imageError || !userImageUrl ? 'defaulProfile.png' : userImageUrl}
                        alt=""
                        className="profile-image"
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                  <h6 className="investor-startup-name">{startup.name}</h6>
                </div>
              ))
            ) : (
              <div style={{ color: "#888", padding: "1rem" }}>
                No startups found in this category.
              </div>
            )}
          </div>
        </div>

        {/* Blog Creation and Display Section */}
        <div className="investor-dashboard-right-section-content3">
          <div className="investor-profile-icon-name-date">
            <div className="startups-list-item-image">
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
            <div className="investor-profile-details">
              <h6 className="investor-startup-name">{profileOwner.first_name || 'N/A'}</h6>
              <h6 className="investor-startup-date">
                {profileOwner.date ? new Date(profileOwner.date).toLocaleDateString() : 'N/A'}
              </h6>
            </div>
          </div>

          <div className="investor-blog-form">
            <h4>{editingBlogId ? "Edit Blog" : "Create Blog"}</h4>
            <form onSubmit={editingBlogId ? handleUpdateBlog : handleBlogSubmit}>
              <input
                type="text"
                placeholder="Blog Title"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Blog Content"
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                rows={4}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBlogImage(e.target.files[0])}
              />
              <button type="submit">{editingBlogId ? "Update Blog" : "Publish Blog"}</button>
              {blogCreated && <p style={{ color: "green" }}>Blog {editingBlogId ? "updated" : "published"} successfully!</p>}
            </form>
          </div>

          <div className="blogs-and-gigs-container">
            {/* Blogs Section */}
            <div className="blogs-section">
              <h4>Your Blogs</h4>
              {error && <p className="error-message">{error}</p>}
              {blogs && blogs.length > 0 ? (
                <div className="blogs-grid">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="investor-blog-card">
                      <h5 className="blog-title">{blog.title || "Untitled Blog"}</h5>
                      <p className="blog-content">
                        {blog.content.length > 100
                          ? `${blog.content.substring(0, 100)}...`
                          : blog.content || "No content available."}
                      </p>
                      {blog.image && (
                        <img
                          src={`http://localhost:3000/uploads/${blog.image}`}
                          alt="Blog"
                          className="blog-image"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      {blog.created_at ? (
                        <p className="blog-date">
                          Posted on: {new Date(blog.created_at).toLocaleDateString()}
                        </p>
                      ) : (
                        <p className="blog-date">Post date not available</p>
                      )}
                      <div className="blog-actions">
                        <button onClick={() => handleEditBlog(blog)}>Edit</button>
                        <button onClick={() => handleDeleteBlog(blog.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !error && <p className="no-blogs-message">No blogs created yet.</p>
              )}
            </div>
          
            {/* Gigs Section */}
            <div className="gigs-section">
              <h3>Gigs Matching Your Category</h3>
              <div className="gigs-list-container">
                {gigs.length > 0 ? (
                  gigs.map((gig) => (
                    <div key={gig.id} className="gig-card-container">
                      <h5 className="gig-card-title">{gig.startup_name}</h5>
                      <p className="gig-card-industry">{gig.industry}</p>
                      <p className="gig-card-location">{gig.location}</p>
                      <p className="gig-card-problem">{gig.problem_statement}</p>
                      {gig.image_path && (
                        <img
                          src={`http://localhost:3000${gig.image_path}`}
                          alt="Gig"
                          className="gig-card-image"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-gigs-message">No gigs found matching your category.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;