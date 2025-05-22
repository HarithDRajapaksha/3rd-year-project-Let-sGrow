import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './authForm.css';

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Add basic validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const endpoint = type === 'register' 
        ? 'http://localhost:5000/api/register' 
        : 'http://localhost:5000/api/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Request failed');
      }

      // Handle login success
      if (type === 'login') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Logged in user ID:', data.user.id);
        navigate('/gigs/new');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{type === 'register' ? 'Create Account' : 'Welcome Back'}</h2>
      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <div className="auth-form-group">
            <label>Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
        )}
        <div className="auth-form-group">
          <label>Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="auth-form-group">
          <label>Password</label>
          <input
            type="password"
            required
            minLength="6"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        {error && <div className="auth-error-message">{error}</div>}
        <button className="auth-error-button" type="submit" disabled={loading}>
          {loading ? 'Processing...' : type === 'register' ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <div className="auth-auth-footer">
        {type === 'register' ? (
          <>
            Already have an account? <Link to="/login">Login here</Link>
          </>
        ) : (
          <>
            Don't have an account? <Link to="/register">Sign up here</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;