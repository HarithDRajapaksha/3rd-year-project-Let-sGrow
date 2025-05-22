import NavigationBar from '../../Components/navigation/NavigationBar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './blogs.css';

export default function Blogs() {
  const userId = localStorage.getItem("userId") || 1;
  const [profileOwner, setProfileOwner] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Fetch profile owner
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

  // Fetch all blogs
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/blogs') 
      .then((response) => setBlogs(response.data))
      .catch((error) => {
        console.error('Error fetching blogs:', error);
      });
  }, []);

  // Open modal with selected blog
  const handleViewGig = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedBlog(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="navbar-container">
        <NavigationBar profileOwner={profileOwner} />
      </div>
      <div className="bp-blogs-container">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="bp-blog-card">
              <h2>{blog.title}</h2>
              <p className='bc'>{blog.content}</p>
              {blog.image && <img src={`http://localhost:3000/uploads/${blog.image}`} alt={blog.title} />}
              <p><strong>Created At:</strong> {new Date(blog.created_at).toLocaleDateString()}</p>
              <button onClick={() => handleViewGig(blog)}>View Gig</button>
            </div>
          ))
        ) : (
          <p>No blogs available</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedBlog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <h2>{selectedBlog.title}</h2>
            <p>{selectedBlog.content}</p>
            {selectedBlog.image && <img src={`http://localhost:3000/uploads/${selectedBlog.image}`} alt={selectedBlog.title} />}
            <p><strong>Created At:</strong> {new Date(selectedBlog.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}