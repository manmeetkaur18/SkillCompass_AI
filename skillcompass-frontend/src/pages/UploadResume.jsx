import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadResume.css"; // 👈 make sure this CSS file exists

function UploadResume() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume file to upload!");
      return;
    }

    // 👇 You can later connect this to your backend upload API
    console.log("Uploaded File:", file.name);
    alert("Resume uploaded successfully!");
    navigate("/dashboard"); // redirects to dashboard after upload
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h1>📤 Upload Your Resume</h1>
        <p className="subtitle">
          Choose your resume file to analyze your skills and get career insights.
        </p>

        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          <button type="submit">Upload & Continue</button>
        </form>

        <p className="note">Supported formats: PDF, DOC, DOCX</p>
      </div>
    </div>
  );
}

export default UploadResume;
