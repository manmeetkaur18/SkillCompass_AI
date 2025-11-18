import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const careerPaths = {
  "Frontend Developer": {
    title: "Frontend Developer",
    description:
      "Focus on user interface development using modern frameworks like React and Next.js.",
    roadmap: [
      { week: "Week 1", task: "Master HTML, CSS, and Responsive Design" },
      { week: "Week 2", task: "Learn JavaScript ES6+ features" },
      { week: "Week 3", task: "Understand React fundamentals & hooks" },
      { week: "Week 4", task: "Build 2 real-world React projects" },
      { week: "Week 5", task: "Learn Next.js and deploy portfolio" },
    ],
  },
  "Backend Developer": {
    title: "Backend Developer",
    description:
      "Learn to design robust APIs and server-side systems using Node.js and databases.",
    roadmap: [
      { week: "Week 1", task: "Learn Node.js and Express.js basics" },
      { week: "Week 2", task: "Work with MongoDB or PostgreSQL" },
      { week: "Week 3", task: "Build a REST API project" },
      { week: "Week 4", task: "Learn Authentication & JWT" },
      { week: "Week 5", task: "Add deployment & cloud basics (Render, AWS)" },
    ],
  },
  "AI Engineer": {
    title: "AI Engineer",
    description:
      "Learn machine learning, deep learning, and practical AI model deployment.",
    roadmap: [
      { week: "Week 1", task: "Understand Python & data preprocessing" },
      { week: "Week 2", task: "Study ML algorithms (Scikit-learn)" },
      { week: "Week 3", task: "Dive into Deep Learning (TensorFlow/PyTorch)" },
      { week: "Week 4", task: "Train a simple neural network" },
      { week: "Week 5", task: "Deploy AI model using Flask or Streamlit" },
    ],
  },
};

export default function Dashboard() {
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("selectedRole");
    if (savedRole) setSelectedRole(savedRole);
  }, []);

  const skillData = {
    labels: ["React", "Node.js", "Python", "jQuery"],
    datasets: [
      {
        label: "Skill Demand Score",
        data: [0.84, 0.72, 0.68, 0.12],
        backgroundColor: ["#60a5fa", "#34d399", "#fbbf24", "#f87171"],
        borderColor: ["#3b82f6", "#10b981", "#facc15", "#ef4444"],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "📊 Skill Demand Trend Analysis (2025)",
        font: { size: 18, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `${value * 100}%` },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🚀 SkillCompass AI Dashboard</h1>
      <p className="dashboard-subtitle">
        Get a personalized breakdown of your skills, career path, and market
        insights — all powered by AI and real-time data.
      </p>

      <div className="dashboard-card">
        <Bar data={skillData} options={options} />
      </div>

      <section className="dashboard-card">
        <h2>🎯 Personalized Career Path Recommendation</h2>
        {selectedRole && careerPaths[selectedRole] ? (
          <>
            <p>
              Based on your interest, we recommend the{" "}
              <b className="highlight">{careerPaths[selectedRole].title}</b> path.
            </p>
            <p>{careerPaths[selectedRole].description}</p>
            <h3>🗓 5-Week Learning Roadmap</h3>
            <ul>
              {careerPaths[selectedRole].roadmap.map((step, i) => (
                <li key={i}>
                  <b>{step.week}</b>: {step.task}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="note">No role selected yet. Please upload your resume.</p>
        )}
      </section>

      <section className="dashboard-card">
        <h2>🚀 Next Best Skills to Learn</h2>
        <div className="skill-grid">
          {[
            { name: "TypeScript", demand: "High", difficulty: "Medium" },
            { name: "Next.js", demand: "Very High", difficulty: "Medium" },
            { name: "Docker", demand: "Rising", difficulty: "Hard" },
          ].map((skill, i) => (
            <div key={i} className="skill-box">
              <h3>{skill.name}</h3>
              <p>
                Demand: {skill.demand} <br /> Difficulty: {skill.difficulty}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-card">
        <h2>⚠️ Skill Saturation Alerts</h2>
        <ul>
          <li>⚠ jQuery usage has dropped by 60% since 2023.</li>
          <li>📉 PHP Developer demand is declining.</li>
          <li>💡 Switch to React or Next.js for better growth.</li>
        </ul>
      </section>

      <section className="dashboard-card">
        <h2>📈 Market Demand Insights</h2>
        <ul>
          <li>🔥 AI & ML roles increased by 35% in 2025.</li>
          <li>💼 Full Stack Developers remain in high demand.</li>
          <li>💰 React Developers: ₹10–18 LPA average in India.</li>
          <li>🌍 Remote tech roles up by 40% since 2024.</li>
        </ul>
      </section>

      <section className="dashboard-card">
        <h2>🧭 Next Steps for Growth</h2>
        <ul>
          <li>✅ Deepen React knowledge — Hooks & Context API.</li>
          <li>🚀 Learn JWT Authentication & API Security.</li>
          <li>📚 Build real-world projects for your portfolio.</li>
        </ul>
      </section>

      <section className="dashboard-card">
        <h2>💼 Job Matches Based on Your Skills</h2>
        <ul>
          <li><b>Frontend Developer @ Google</b> — 93% Match</li>
          <li><b>Full Stack Engineer @ Microsoft</b> — 91% Match</li>
          <li><b>AI Intern @ OpenAI</b> — 88% Match</li>
        </ul>
      </section>

      <div className="nav-buttons">
        <Link to="/upload" className="upload-btn">📤 Upload New Resume</Link>
        <Link to="/">🔙 Back to Home</Link>
      </div>

      <footer>© {new Date().getFullYear()} SkillCompass AI. All rights reserved.</footer>
    </div>
  );
}
