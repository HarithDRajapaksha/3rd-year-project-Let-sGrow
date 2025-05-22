import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './gigView.css';

const GigView = () => {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/gig/${id}`);
        const data = await response.json();
        const gigData = Array.isArray(data) ? data[0] : data;
        setGig(gigData);
        setForm(gigData);
        setPreviewImage(
          gigData.image_path
            ? gigData.image_path.startsWith("/uploads/")
              ? `http://localhost:3000${gigData.image_path}`
              : gigData.image_path
            : null
        );
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleEdit = () => setEditMode(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedGig = { ...form };

      // If a new image is selected, upload it first
      if (imageFile) {
        const imgForm = new FormData();
        imgForm.append('image', imageFile);

        const uploadRes = await fetch(`http://localhost:3000/api/gig/${id}/upload-image`, {
          method: 'POST',
          body: imgForm,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.image_path) {
          updatedGig.image_path = uploadData.image_path;
        }
      }

      // Update gig details
      const response = await fetch(`http://localhost:3000/api/gig/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGig),
      });
      if (response.ok) {
        const updated = await response.json();
        setGig(updated.gig);
        setEditMode(false);
        setImageFile(null);
      } else {
        alert('Failed to update gig');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!gig) return <div className="loading">Gig not found.</div>;

  return (
    <div className="gig-view-container">
      <header className="gig-header">
        <h1>
          {editMode ? (
            <input
              name="startup_name"
              value={form.startup_name || ''}
              onChange={handleChange}
            />
          ) : (
            gig.startup_name || gig.Startup_name
          )}
        </h1>
        <div className="gig-meta">
          <span className="industry">
            {editMode ? (
              <input
                name="industry"
                value={form.industry || ''}
                onChange={handleChange}
              />
            ) : (
              gig.industry || gig.Industry
            )}
          </span>
          <span className="location">
            {editMode ? (
              <input
                name="location"
                value={form.location || ''}
                onChange={handleChange}
              />
            ) : (
              gig.location || gig.Location
            )}
          </span>
          {gig.created_at && (
            <time>{new Date(gig.created_at).toLocaleDateString()}</time>
          )}
        </div>
        {!editMode && (
          <button className="edit-gig-btn" onClick={handleEdit}>
            Edit Gig
          </button>
        )}
        {editMode && (
          <button className="save-gig-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save All'}
          </button>
        )}
      </header>

      {(previewImage || gig.image_path) && (
        <div className="gig-image">
          <img
            src={previewImage || (gig.image_path.startsWith("/uploads/")
              ? `http://localhost:3000${gig.image_path}`
              : gig.image_path)}
            alt="Gig"
            style={{ width: "100%", maxWidth: 400, borderRadius: 10, margin: "1rem 0" }}
          />
          {editMode && (
            <div style={{ marginTop: "0.5rem" }}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
          )}
        </div>
      )}

      <section className="main-content">
        <div className="gig-section">
          <h3>Startup Name</h3>
          {editMode ? (
            <input
              name="startup_name"
              value={form.startup_name || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.startup_name || gig.Startup_name}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Industry/Sector</h3>
          {editMode ? (
            <input
              name="industry"
              value={form.industry || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.industry || gig.Industry}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Location</h3>
          {editMode ? (
            <input
              name="location"
              value={form.location || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.location || gig.Location}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Founder(s) Name(s)</h3>
          {editMode ? (
            <input
              name="founder_name"
              value={form.founder_name || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.founder_name}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Website</h3>
          {editMode ? (
            <input
              name="website"
              value={form.website || ''}
              onChange={handleChange}
            />
          ) : (
            <a href={gig.website || gig.Website} target="_blank" rel="noopener noreferrer">
              {gig.website || gig.Website}
            </a>
          )}
        </div>
        <div className="gig-section">
          <h3>Contact Number</h3>
          {editMode ? (
            <input
              name="contact_number"
              value={form.contact_number || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.contact_number || gig.Contact_Number}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Problem Statement</h3>
          {editMode ? (
            <textarea
              name="problem_statement"
              value={form.problem_statement || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.problem_statement || gig.problemStatement}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Solution Description</h3>
          {editMode ? (
            <textarea
              name="solution_description"
              value={form.solution_description || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.solution_description || gig.solutionDescription}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Value Proposition</h3>
          {editMode ? (
            <textarea
              name="value_proposition"
              value={form.value_proposition || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.value_proposition || gig.valueProposition}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Target Market</h3>
          {editMode ? (
            <textarea
              name="target_market"
              value={form.target_market || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.target_market || gig.targetMarket}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Revenue Streams</h3>
          {editMode ? (
            <textarea
              name="revenue_streams"
              value={form.revenue_streams || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.revenue_streams || gig.revenueStreams}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Pricing Strategy</h3>
          {editMode ? (
            <textarea
              name="pricing_strategy"
              value={form.pricing_strategy || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.pricing_strategy || gig.pricingStrategy}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Current Stage</h3>
          {editMode ? (
            <input
              name="current_stage"
              value={form.current_stage || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.current_stage || gig.currentStage}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Investment Type</h3>
          {editMode ? (
            <input
              name="investment_type"
              value={form.investment_type || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.investment_type || gig.investmentType}</p>
          )}
        </div>
        <div className="gig-section">
          <h3>Equity Offered</h3>
          {editMode ? (
            <input
              name="equity_offered"
              value={form.equity_offered || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{gig.equity_offered || gig.equityOffered}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default GigView;