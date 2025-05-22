import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css";


const ForgotPassword = () => { 

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }

   
      axios.post('http://localhost:3000/api/request-otp', { email }) 
        .then(response => {
            console.log(response.data);
            navigate('/otp-verification', { state: { email } });
        })
        .catch(error => {
            console.error('Error requesting OTP!', error);
            setError("Failed to send OTP. Please try again.");
        });
  };


  return (
    <div className="ForgotPassword-container">
      <h1 className="ForgotPassword-title">FORGOT PASSWORD</h1>
      <p className="ForgotPassword-subtitle"> Please Enter the email address  you’d like your password reset  information sent to</p>
      <form className="ForgotPassword-form" onSubmit={handleSubmit}>

        <div className="ForgotPassword-email">
          <input 
          type = "text" 
          id="email" 
          className={`input ${!email ? "email" : "placeholder-active"}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required></input>
          <label htmlFor="email" className="ForgotPassword-label">E-mail</label>
          <i className="ForgotPassword-email-icon"><ion-icon name="mail"></ion-icon></i> 
        </div>
          
        
        {error && <p className="error">{error}</p>}
        <button type="submit" className="OTP-button">Request OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword; 