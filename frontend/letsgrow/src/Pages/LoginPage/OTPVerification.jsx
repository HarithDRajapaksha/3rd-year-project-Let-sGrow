import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./otpVerification.css";
import axios from "axios";

const OTPVerification = () => {
  const location = useLocation();
  const email = location.state?.email || "example@gmail.com";
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(5).fill(""));
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    console.log("Verifying OTP:", enteredOtp, "for email:", email);
      axios.post('http://localhost:3000/api/verify-otp', { email, otp: enteredOtp }) 
        .then(response => {
        console.log(response.data);
        navigate('/change-password', { state: { email } });
        })
        .catch(error => {
          console.error('Error verifying OTP!', error);
          alert("Invalid or expired OTP.");
        });
  };
  
    const handleResend = () => {
      setOtp(new Array(5).fill(""));
      setTimer(60);
      setResendDisabled(true);
  
      axios.post('http://localhost:3000/api/resend-otp', { email }) 
          .then(response => {
              console.log(response.data);
              alert("OTP has been resent to your email.");
          })
          .catch(error => {
              console.error('Error resending OTP!', error);
              alert("Failed to resend OTP. Please try again later.");
          });
  };

  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <p>
        One-time password (OTP) has been sent via Email to{" "}
        <strong>{email}</strong>

      </p>
      <p>Enter the OTP below to verify it.</p>

      <div className="otp-inputs">
        {otp.map((_, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            maxLength="1"
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
          />
        ))}
      </div>

      <p className="resend-text">
        Resend OTP in: {timer > 0 ? `00:${timer < 10 ? "0" + timer : timer}` : "00:00"}
      </p>

      <button onClick={handleSubmit} className="verify-btn">
        Verify OTP
      </button>

      <button
        onClick={handleResend}
        className="resend-btn"
        disabled={resendDisabled}
      >
        Resend OTP
      </button>
    </div>
  );
};

export default OTPVerification;