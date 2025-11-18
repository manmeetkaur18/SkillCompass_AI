import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import UploadResume from "./pages/UploadResume";
import Dashboard from "./pages/Dashboard";
import SkillInput from "./pages/SkillInput"; // ✅ Skill Input Page

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 🏠 Landing Page */}
          <Route path="/" element={<Welcome />} />

          {/* 📤 Resume Upload Page */}
          <Route path="/upload" element={<UploadResume />} />

          {/* 📊 Dashboard Page */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 🧠 Skill Input Page */}
          <Route path="/skills" element={<SkillInput />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
