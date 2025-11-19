import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SkillInput.css";
import { updateSkills, getCareerRecommendation } from "../services/api";

export default function SkillInput() {
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState("");
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const addSkill = () => {
    if (input.trim()) {
      setSkills([...skills, { name: input.trim(), rating }]);
      setInput("");
      setRating(3);
    }
  };

  const handleSubmit = async () => {
    if (skills.length === 0) {
      alert("Add at least one skill.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Save skills to backend
      await updateSkills({ skills }, token);

      // 2️⃣ Get career recommendation from backend
      const res = await getCareerRecommendation(skills, token);

      // 3️⃣ Save recommendation to localStorage for Dashboard
      localStorage.setItem("careerRecommendation", JSON.stringify(res.data));

      alert("Skills analyzed successfully!");

      navigate("/dashboard");
    } catch (err) {
      console.error("Skill input error:", err);
      alert("Failed to process skills. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skill-page">
      <h1>🧠 Add Your Skills</h1>
      <p>
        Enter your current tech skills and rate your proficiency to help the AI
        personalize your career path.
      </p>

      <div className="skill-card">
        <input
          type="text"
          placeholder="e.g. React, Python, Node.js"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <label>Skill Rating: {rating}/5</label>
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />

        <button onClick={addSkill} className="add-skill-btn">
          ➕ Add Skill
        </button>
      </div>

      <div className="skills-list">
        <h2>📋 Your Skills</h2>
        {skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          <ul>
            {skills.map((skill, index) => (
              <li key={index}>
                <span>{skill.name}</span>
                <span>⭐ {skill.rating}/5</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleSubmit} className="next-btn" disabled={loading}>
        {loading ? "⏳ Analyzing..." : "🚀 Analyze Skills & Go to Dashboard"}
      </button>
    </div>
  );
}
