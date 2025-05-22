import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from 'axios'; 
import "./registrationPage.css";

const RegistrationPage = () => {
  const navigate = useNavigate(); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [pricerange, setPriceRange] = useState("");
  const [catergories, setCatergories] = useState("");

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePhoneNumber = (number) => {
    const regex = /^[0-9]{10}$/; 
    return regex.test(number);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required.";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    }
    if (!validateEmail(email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!role) {
      newErrors.role = "Role is required.";
    }
    if (!pricerange) {
      newErrors.range = "Price Range is required.";
    }
    if (!catergories) {
      newErrors.catergories = "Catergories is required.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Proceed with form submission
      const userData = {
        firstName: firstName, 
        lastName: lastName,
        role,
        phoneNumber: phoneNumber, 
        email,
        password,
        pricerange,
        catergories,
      };
    
      axios.post('http://localhost:3000/register', userData)
        .then(response => {
          console.log(response.data);
          navigate('/login'); 
        })
        .catch(error => {
          console.error('There was an error registering the user!', error);
        });
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">CREATE ACCOUNT</h1>
      <p className="register-subtitle">Get started with your free Account</p>
      <form className="register-form" onSubmit={handleSubmit}>

        <div className="reg-firstname">
          <input 
            type="text" 
            id="first-name" 
            className={`input ${!firstName ? "reg-firstname" : "placeholder-active"}`} 
            value={firstName}
            onChange={(e) =>setFirstName(e.target.value)}  
            required 
          />
          <label htmlFor="reg-firstname" className="rf-label">First Name</label>
          <i className="user-icon"><ion-icon name="person"></ion-icon></i>
          {errors.firstName && <p className="reg-error">{errors.firstName}</p>}
        </div>

        <div className="reg-lastname">
          <input 
            type="text" 
            id="last-name" 
            className={`input ${!lastName ? "reg-lastname" : "placeholder-active"}`} 
            value={lastName}
            onChange={(e) =>setLastName(e.target.value)}  
            required 
          />
          <label htmlFor="reg-lastname" className="rf-label">Last Name</label>
          <i className="user-icon"><ion-icon name="person"></ion-icon></i>
          {errors.lastName && <p className="reg-error">{errors.lastName}</p>}
        </div>
      
        <div className="reg-phonenumber">
          <input 
            type="text" 
            id="reg-phone" 
            className={`input ${!phoneNumber ? "reg-phonenumber" : "placeholder-active"}`} 
            value={phoneNumber}
            onChange={(e) =>setPhoneNumber(e.target.value)}  
            required 
          />
          <label htmlFor="reg-phonenumber" className="rf-label">Phone Number</label>
          <i className="phone-icon"><ion-icon name="call"></ion-icon></i>
          {errors.phoneNumber && <p className="reg-error">{errors.phoneNumber}</p>}
        </div>

        <div className="reg-email">
          <input 
            type="text" 
            id="email" 
            className={`input ${!email ? "email" : "placeholder-active"}`} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}  
            required 
          />
          <label htmlFor="email" className="rf-label">E-mail</label>
          <i className="email-icon"><ion-icon name="mail"></ion-icon></i>
          {errors.email && <p className="reg-error">{errors.email}</p>}
        </div>

        <div className="reg-password">
          <input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            className={`input ${!password? "password" : "placeholder-active"}`} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}  
            required 
          />
          <label htmlFor="password" className="rf-label">Password</label>
          <i className="password-icon"><ion-icon name="key"></ion-icon></i>
          <i 
            className="eye-outline-icon" 
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            <ion-icon name={showPassword ? "eye-off-outline" : "eye-outline"}></ion-icon>
          </i>
          {errors.password && <p className="reg-error">{errors.password}</p>}
        </div>

        <div className="reg-confirmpassword">  
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            id="confirm-password" 
            className={`input ${!confirmPassword? "confirmpassword" : "placeholder-active"}`} 
            value={confirmPassword}
            onChange={(e) =>setConfirmPassword(e.target.value)}  
            required 
          />
          <label htmlFor="confirm-password" className="rf-label">Confirm Password</label>
          <i className="confirm-password-icon"><ion-icon name="key"></ion-icon></i>
          <i 
            className="eye-outline-icon" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ cursor: "pointer" }}
          >
            <ion-icon name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}></ion-icon>
          </i>
          {errors.confirmPassword && <p className="reg-error">{errors.confirmPassword}</p>}
        </div>

        <div className="reg-categories">
          <select
            id="categories" 
            className={`input ${!catergories ? "reg-categories" : "placeholder-active"}`} 
            value={catergories} 
            onChange={(e) => setCatergories(e.target.value)} 
            required
          >
            <option value="" disabled>Select Categories</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Transportation">Transportation</option>
            <option value="Energy">Energy</option>
            <option value="Telecommunications">Telecommunications</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Tourism">Tourism</option>
            <option value="Food and Beverage">Food and Beverage</option>
            <option value="Construction">Construction</option>
          </select>
          <label htmlFor="categories" className="rf-label">Categories</label>
          <i className="categories-icon"><ion-icon name="cube"></ion-icon></i>
          {errors.catergories && <p className="reg-error">{errors.catergories}</p>}
        </div>

        <div className="reg-role">
          <select 
            id="role" 
            className={`input ${!role ? "reg-lastname" : "placeholder-active"}`} 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="Investor">Investor</option>
            <option value="Startup">Startup</option>
          </select>
          <label htmlFor="role" className="rf-label">Role</label>
          <i className="user-icon"><ion-icon name="people"></ion-icon></i>
          {errors.role && <p className="reg-error">{errors.role}</p>}
        </div>
      
        <div className="price-range">
          <select 
            id="price-range" 
            className={`input ${!pricerange ? "reg-lastname" : "placeholder-active"}`} 
            value={pricerange} 
            onChange={(e) => setPriceRange(e.target.value)} 
            required
          >
            <option value="" disabled>Select Price Range</option>
            <option value="$10,000-$20,000">$10,000-$20,000</option>
            <option value="$20,000-$50,000">$20,000-$50,000</option>
            <option value="$50,000-$100,000">$50,000-$100,000</option>
            <option value="$100,000-$250,000">$100,000-$250,000</option>
            <option value="$250,000-$500,000">$250,000-$500,000</option>
            <option value="$500,000-$1,000,000">$500,000-$1,000,000</option>
            <option value="Above $1,000,000">Above $1,000,000</option>
          </select>
          <label htmlFor="range" className="rf-label">Price Range</label>
          <i className="usd-icon"><ion-icon name="logo-usd"></ion-icon></i>
          {errors.pricerange && <p className="reg-error">{errors.pricerange}</p>}
        </div>
      
        <button className="register-button" type="submit">Register</button> 
        <p className="register-subtitle">Have you an Account?
          <button
            type="button"
            className="login-button"
            onClick={() => navigate('/login')}
            style={{
              background:"none",
              color: 'rgba(32, 201, 151, 0.76)',
              padding: '10px',
              border: 'none',
              borderRadius: 'none',
              cursor: 'pointer',
              fontFamily:'Times New Roman, Times, serif',
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegistrationPage;