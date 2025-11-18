import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SkillInput.css";

export default function SkillInput() {
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState("");
  const [rating, setRating] = useState(3);
  const navigate = useNavigate();

  const addSkill = () => {
    if (input.trim()) {
      setSkills([...skills, { name: input, rating }]);
      setInput("");
      setRating(3);
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

      <button onClick={() => navigate("/dashboard")} className="next-btn">
        🚀 Analyze Skills & Go to Dashboard
      </button>
    </div>
  );
}
