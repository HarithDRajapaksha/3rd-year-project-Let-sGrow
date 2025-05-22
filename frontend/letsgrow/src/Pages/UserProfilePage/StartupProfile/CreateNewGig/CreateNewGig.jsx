import React, { useState } from "react";
import "./createNewGig.css";
import { useNavigate } from "react-router-dom";

const CreateNewGig = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    Startup_name: "",
    Industry: "",
    Location: "",
    founder_name: "",
    Website: "",
    Contact_Number: "",
    problemStatement: "",
    solutionDescription: "",
    valueProposition: "",
    targetMarket: "",
    revenueStreams: "",
    pricingStrategy: "",
    currentStage: "",
    investmentType: "",
    equityOffered: "",
  });

  const [errors, setErrors] = useState({});

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handlePlaceholderClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = "This field is required";
      }
    });

    if (!selectedImage) {
      newErrors["image"] = "Startup image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      const imageFile = document.getElementById('fileInput').files[0];

      // Append all form data
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append user_id (replace with actual user id from auth/localStorage if available)
      const userId = localStorage.getItem("userId") || 1;
      formDataToSend.append('user_id', userId);

      // Append image file
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      try {
        const response = await fetch('http://localhost:3000/api/gigs', {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          alert("Gig created successfully!");
          navigate("/startup-dashboard");
        } else {
          alert("Submission failed. Please try again.");
        }
      } catch (error) {
        console.error('Error:', error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please fill all required fields.");
    }
  };

  return (
    <div className="container">
      <h1>Create New Gigs</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="sidebar">
            {/* Image Upload */}
            <div
              className="image-placeholder"
              onClick={handlePlaceholderClick}
              title="Click to upload image"
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Uploaded" className="uploaded-image" />
              ) : (
                <span>+</span>
              )}
            </div>
            {errors.image && <p className="error">{errors.image}</p>}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />

            <h2>Startup Information</h2>
            <div className="inputs-group">
              <label>Startup Name</label>
              <input
                type="text"
                name="Startup_name"
                value={formData.Startup_name}
                onChange={handleChange}
                placeholder="Enter startup name"
                required
              />
              {errors.Startup_name && <p className="error">{errors.Startup_name}</p>}

              <label>Industry/Sector</label>
              <input
                type="text"
                name="Industry"
                value={formData.Industry}
                onChange={handleChange}
                placeholder="Enter industry or sector"
                required
              />
              {errors.Industry && <p className="error">{errors.Industry}</p>}

              <label>Location</label>
              <input
                type="text"
                name="Location"
                value={formData.Location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
              {errors.Location && <p className="error">{errors.Location}</p>}

              <label>Founder(s) Name(s)</label>
              <input
                type="text"
                name="founder_name"
                value={formData.founder_name}
                onChange={handleChange}
                placeholder="Enter founder(s) name(s)"
                required
              />
              {errors.founder_name && <p className="error">{errors.founder_name}</p>}

              <label>Website</label>
              <input
                type="url"
                name="Website"
                value={formData.Website}
                onChange={handleChange}
                placeholder="Enter website URL"
                required
              />
              {errors.Website && <p className="error">{errors.Website}</p>}

              <label>Contact Number</label>
              <input
                type="tel"
                name="Contact_Number"
                value={formData.Contact_Number}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
              />
              {errors.Contact_Number && <p className="error">{errors.Contact_Number}</p>}
            </div>
          </div>

          {/* Main Form Content with Placeholders */}
          <div className="main-content">
            {[
              { label: "Problem Statement",
                name: "problemStatement",
                placeholder: "What problem does the startup solve? Describe the pain point in the market." },

              { label: "Solution Description",
                name: "solutionDescription",
                placeholder: "What is the product or service? How does it solve the problem?" },

              { label: "Value Proposition",
                name: "valueProposition",
                placeholder: "Why is this solution valuable to customers? What makes it unique compared to other solutions?" },

              { label: "Target Market",
                name: "targetMarket",
                placeholder: "Who are the potential customers? Describe demographics, behaviors, or specific market needs.." },

              { label: "Revenue Streams",
                name: "revenueStreams",
                placeholder: "How will the startup generate revenue? (e.g., subscription, direct sales, advertising)" },

              { label: "Pricing Strategy",
                name: "pricingStrategy",
                placeholder: "What is the pricing model, and how does it compare to competitors?" },

              { label: "Current Stage",
                name: "currentStage",
                placeholder: "What stage is your startup currently in? (e.g., idea, prototype, MVP, revenue, scaling)" },

              { label: "Investment Type",
                name: "investmentType",
                placeholder: "What kind of investment are you offering (equity, debt, convertible notes, etc.)?" },

              { label: "Equity Offered",
                name: "equityOffered",
                placeholder: "What percentage of the company are you offering in exchange for the investment?" },
            ].map((field) => (
              <div className="form-section" key={field.name}>
                <label>{field.label}</label>
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                />
                {errors[field.name] && <p className="error">{errors[field.name]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateNewGig;