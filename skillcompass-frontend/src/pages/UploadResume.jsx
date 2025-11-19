import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadResume.css";
import { api } from "../services/api";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume file!");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Prepare file for upload
      const formData = new FormData();
      formData.append("resume", file);

      // 2️⃣ Upload to backend for AI extraction
      const extractRes = await api.upload.extractResume(formData);

      const extractedSkills = extractRes.data.skills;
      if (!extractedSkills || extractedSkills.length === 0) {
        alert("No skills detected. Try another resume.");
        return;
      }

      // 3️⃣ Save extracted skills to DB
      await api.user.updateSkills(extractedSkills);

      // 4️⃣ Get recommendation from backend
      const recRes = await api.recommendation.getRecommendation(extractedSkills);

      // 5️⃣ Save to localStorage (Dashboard reads this)
      localStorage.setItem("bestRole", recRes.data.bestRole);
      localStorage.setItem("matchPercentage", recRes.data.matchPercentage);
      localStorage.setItem("missingSkills", JSON.stringify(recRes.data.missingSkills));
      localStorage.setItem("roadmap", JSON.stringify(recRes.data.roadmap));

      // 6️⃣ Navigate to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Resume upload error:", err);
      alert("Resume processing failed. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h1>📤 Upload Your Resume</h1>
        <p className="subtitle">
          Our AI will scan your resume, extract skills, and build your personalized job path.
        </p>

        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "⏳ Processing..." : "Upload & Analyze"}
          </button>
        </form>

        <p className="note">Supported formats: PDF, DOC, DOCX</p>
      </div>
    </div>
  );
}

export default UploadResume;
