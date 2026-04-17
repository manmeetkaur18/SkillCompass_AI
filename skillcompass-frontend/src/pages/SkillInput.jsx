import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateSkills, getCareerRecommendation } from "../services/api";

export default function SkillInput() {
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState("");
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ➕ Add skill
  const addSkill = () => {
    if (input.trim()) {
      setSkills([...skills, { name: input.trim(), rating }]);
      setInput("");
      setRating(3);
    }
  };

  // 🚀 Submit skills
  const handleSubmit = async () => {
    if (skills.length === 0) {
      alert("Add at least one skill");
      return;
    }

    try {
      setLoading(true);

      // 1. Save skills
      await updateSkills({ skills }, token);

      // 2. Get recommendation
      const res = await getCareerRecommendation(skills, token);

      // 3. Store in localStorage
      localStorage.setItem(
        "careerRecommendation",
        JSON.stringify(res.data)
      );

      alert("Skills analyzed successfully!");

      // 4. Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error processing skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧠 Add Your Skills</h1>

      <input
        type="text"
        placeholder="e.g. React, Python"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div>
        <label>Rating: {rating}/5</label>
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </div>

      <button onClick={addSkill}>➕ Add Skill</button>

      <h3>Your Skills:</h3>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>
            {skill.name} ⭐ {skill.rating}
          </li>
        ))}
      </ul>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "⏳ Processing..." : "🚀 Submit"}
      </button>
    </div>
  );
}