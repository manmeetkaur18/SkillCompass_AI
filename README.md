🚀 SkillCompass AI

Dynamic AI-Powered Career Path Recommendation System

SkillCompass AI is a real-time skill analysis and job-market tracking platform that recommends personalized tech career paths based on current skills, industry demand, and future growth trends.

It helps learners avoid outdated skills, choose the best role, and learn the highest ROI skills for their future.

🌟 Key Features
🧠 AI-Powered Career Recommendation

Matches user skills with job roles (Frontend, Backend, AI Engineer, etc.)

Computes match percentage using skill ratings.

Recommends the highest-demand missing skills using weighted scoring.

📈 Trend Prediction & Saturation Alerts

Shows trending vs declining skills

Warns if a career path is becoming less relevant.

👨‍💻 Personalized Skill Roadmap

Returns top 3 missing skills to learn next.

Uses formula:

score = (0.6 * growth) + (0.3 * demand) - (0.1 * difficulty)

💼 Job Matching (MVP)

Suggests jobs based on recommended skill stack (dummy data for MVP).

💰 Salary Insights

Displays salary range for each tech role.

🔐 Secure Authentication + Skill Storage

JWT login system

MongoDB persistence for user skills and profiles

🏗️ Tech Stack
Layer	Technologies
Frontend	React, TailwindCSS, Recharts
Backend	Node.js, Express.js
Database	MongoDB + Mongoose
Auth	JWT, bcryptjs
AI Logic	Custom Scoring + ML (Future Integration)
📂 Project Structure
backend/
 ├─ src/
 │   ├─ controllers/
 │   │   ├─ authController.js
 │   │   ├─ userController.js
 │   │   ├─ careerController.js
 │   │   ├─ jobController.js
 │   │   └─ skillController.js
 │   ├─ routes/
 │   │   ├─ authRoutes.js
 │   │   ├─ userRoutes.js
 │   │   ├─ careerRoutes.js
 │   │   ├─ skillRoutes.js
 │   │   └─ jobRoutes.js
 │   ├─ models/
 │   │   ├─ User.js
 │   │   └─ Skill.js
 │   ├─ middleware/
 │   │   └─ authMiddleware.js
 │   ├─ utils/
 │   │   └─ scoring.js
 │   ├─ data/
 │   │   ├─ skills.json
 │   │   └─ roles.json
 │   ├─ app.js
 │   └─ server.js
 ├─ .env
 └─ package.json

⚙️ Setup & Installation
📌 Prerequisites

Node.js ≥ 16

MongoDB (local or Atlas)

npm

📌 Clone Repository
git clone https://github.com/manmeetkaur18/SkillCompass_AI.git
cd SkillCompass_AI/backend

📌 Install Dependencies
npm install

📌 Add Environment Variables in .env
MONGO_URI=mongodb://127.0.0.1:27017/skillCompassAI
PORT=3000
JWT_SECRET=your_secret_key

📌 Start the Server
npm run dev

📌 API Documentation
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Create new user
POST	/api/auth/login	Login user & get token
👤 User Skill Management
Method	Endpoint	Description
POST	/api/user/skills	Save/Update skills (requires token)
🧠 Career Recommendations
Method	Endpoint	Description
POST	/api/careers/recommend	AI recommendation based on skills
💼 Job Matching (MVP)
Method	Endpoint
GET	/api/jobs?role=Frontend%20Developer
🧪 Sample Request
➕ Update Skills
{
  "skills": [
    { "name": "HTML", "rating": 8 },
    { "name": "CSS", "rating": 7 },
    { "name": "JavaScript", "rating": 9 }
  ]
}

🧠 Recommendation Example Output
{
  "role": "Frontend Developer",
  "matchPercentage": 72,
  "recommendedSkills": [
    { "name": "React", "calculatedScore": 74.7 },
    { "name": "Git", "calculatedScore": 49.5 }
  ]
}

🧩 Future Enhancements

🔮 Real AI model for predicting market trends
🌏 Live scraping from LinkedIn, Indeed, Naukri
📊 Admin analytics panel
📚 Personalized learning plan (Roadmap timeline)
👨‍🎓 Resume + portfolio builder based on skill gap
🧪 Interview question recommendations

🤝 Contribution Guidelines

Fork the repo

Create a feature branch

Write clean code (follow MVC + modular imports)

Submit PR with clear description

💡 Motivation

“Students waste months learning outdated skills.
SkillCompass AI guides them towards the right skills at the right time based on real market demand.”
