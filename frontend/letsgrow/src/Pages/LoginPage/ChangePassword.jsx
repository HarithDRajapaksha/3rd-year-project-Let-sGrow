import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'; 
import "./changePassword.css";

const ChangePassword = () => { 
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; 

  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is missing. Please try again.");
      return;
    }
    if (!password || !newpassword || password !== newpassword) {
      setError("Passwords do not match or are empty.");
      return;
    }
    axios.post('http://localhost:3000/api/reset-password', { email, newPassword: password })
      .then(response => {
        console.log(response.data);
        alert("Password reset successfully.");
        navigate('/login');
      })
      .catch(error => {
        console.error('Error resetting password!', error);
        setError("Failed to reset password.");
      });
  };

  return (
    <div className="login-container">
      <h1 className="Chg-pass-title">RESET PASSWORD</h1>
      <form className="Chg-pass-form" onSubmit={handleSubmit}>

        <div className="chg-password">
          <input 
            type="text" 
            id="pass" 
            className={`input ${!password ? "password" : "placeholder-active"}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="pass" className="chg-label">New Password</label>
          <i className="chg-password-icon"><ion-icon name="key"></ion-icon></i> 
        </div>
        
        <div className="chg-new-password">
          <input 
            type="text" 
            id="new pass" 
            className={`input ${!newpassword ? "newpassword" : "placeholder-active"}`}
            value={newpassword} 
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label htmlFor="new pass" className="chg-label">Confirm Password</label>
          <i className="chg-password-icon"><ion-icon name="key"></ion-icon></i> 
        </div>
       
        {error && <p className="error">{error}</p>}
        <button type="submit" className="chg-pass-confirm-button">Confirm</button>
      </form>
    </div>
  );
};

export default ChangePassword;