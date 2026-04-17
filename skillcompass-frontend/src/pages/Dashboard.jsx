import { useEffect, useState } from "react";
import "./Dashboard.css";
import { api } from "../services/api";
// import LogoutButton from "../components/LogoutButton";
// import { logout } from "../services/api";

export default function Dashboard() {
  const [bestRole, setBestRole] = useState("");
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [missingSkills, setMissingSkills] = useState([]);
  const [roadmap, setRoadmap] = useState([]);

  const [trendingSkills, setTrendingSkills] = useState([]);
  const [jobMatches, setJobMatches] = useState([]);
  const [careerInsights, setCareerInsights] = useState(null);

  // 🔥 Load saved recommendation + fetch backend data
  useEffect(() => {
    // Load from localStorage (saved during SkillInput)
    const role = localStorage.getItem("bestRole");
    setBestRole(role || "");

    setMatchPercentage(Number(localStorage.getItem("matchPercentage") || 0));
    setMissingSkills(JSON.parse(localStorage.getItem("missingSkills") || "[]"));
    setRoadmap(JSON.parse(localStorage.getItem("roadmap") || "[]"));

    if (role) {
      fetchTrending();
      fetchJobs(role);
      fetchInsights(role);
    }
  }, []);

  // 🔥 Fetch Trending Skills
  const fetchTrending = async () => {
    try {
      const res = await api.insights.getTrendingSkills();
      setTrendingSkills(res.data.trendingSkills);
    } catch (err) {
      console.error("Trending skill fetch failed:", err);
    }
  };

  // 🔥 Fetch Job Matches
  const fetchJobs = async (role) => {
    try {
      const userSkills = JSON.parse(
        localStorage.getItem("missingSkills") || "[]"
      );

      const res = await api.insights.getJobMatches(role, userSkills);
      setJobMatches(res.data.jobs || []);
    } catch (err) {
      console.error("Job fetch failed:", err);
    }
  };

  function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

  // 🔥 Fetch Career Insights
  const fetchInsights = async (role) => {
    try {
      const res = await api.insights.getCareerInsights(role);
      setCareerInsights(res.data);
    } catch (err) {
      console.error("Insights fetch failed:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🚀 SkillCompass AI Dashboard</h1>
      <p className="dashboard-subtitle">
        Your personalized skill analysis, job matching, and market insights —
        powered by AI.
      </p>

      {/* 🎯 Best Role */}
      <div className="dashboard-card">
        <h2>🎯 Best Matched Career Role</h2>

        {bestRole ? (
          <>
            <p>
              Your recommended role is:
              <b className="highlight"> {bestRole}</b>
            </p>
            <p>Match Score: {matchPercentage}%</p>

            <h3>Missing Skills:</h3>
            <ul>
              {missingSkills.length === 0 && <p>No missing skills 🎉</p>}
              {missingSkills.map((skill, i) => (
                <li key={i}>⚡ {skill}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="note">Please upload skills to get recommendations.</p>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LogoutButton />
      </div>

      {/* 🗺 Roadmap */}
      <div className="dashboard-card">
        <h2>🗺 Personalized 4-Week Roadmap</h2>
        {roadmap.length ? (
          <ul>
            {roadmap.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        ) : (
          <p className="note">No roadmap available.</p>
        )}
      </div>

      {/* 🔥 Trending Skills */}
      <div className="dashboard-card">
        <h2>🔥 Trending Tech Skills</h2>
        <div className="skill-grid">
          {trendingSkills.map((s, i) => (
            <div key={i} className="skill-box">
              <h3>{s.name}</h3>
              <p>Demand: {s.demand}</p>
              <p>Growth: {s.growth}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={logout} className="upload-btn">Logout</button>

      {/* 📈 Career Insights */}
      <div className="dashboard-card">
        <h2>📈 Career Insights for {bestRole}</h2>

        {careerInsights ? (
          <ul>
            <li>💰 Avg Salary: {careerInsights.avgSalary}</li>
            <li>📊 Job Growth: {careerInsights.jobGrowth}</li>
            <li>⚠️ Saturation: {careerInsights.saturationLevel}</li>
            <li>🔥 Avg Demand Score: {careerInsights.avgDemand}</li>
            <li>📈 Avg Growth Score: {careerInsights.avgGrowth}</li>
            <li>⭐ Key Trends: {careerInsights.keyTrends.join(", ")}</li>
          </ul>
        ) : (
          <p className="note">No insights found</p>
        )}
      </div>

      {/* 💼 Job Matches */}
      <div className="dashboard-card">
        <h2>💼 Job Matches</h2>

        {jobMatches.length === 0 ? (
          <p className="note">No jobs found for this role yet.</p>
        ) : (
          <ul>
            {jobMatches.map((job, i) => (
              <li key={i}>
                <b>{job.title}</b> at {job.company} — {job.fitScore}% Fit
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer>© {new Date().getFullYear()} SkillCompass AI</footer>
    </div>
  );
}
