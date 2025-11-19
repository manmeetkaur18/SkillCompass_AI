import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// ------------------ AUTH ------------------

export function loginUser(data) {
  return api.post("/auth/login", data);
}

export function registerUser(data) {
  return api.post("/auth/register", data);
}

// ------------------ SKILLS ------------------

export function updateSkills(data, token) {
  return api.post("/user/skills", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ------------------ CAREER RECOMMENDATION ------------------

export function getCareerRecommendation(skills, token) {
  return api.post("/skills/recommendation", { skills }, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ------------------ TRENDING SKILLS ------------------

export function getTrendingSkills() {
  return api.get("/skills/trending");
}

// ------------------ LOGOUT (FRONTEND ONLY) ------------------

export function logout() {
  localStorage.removeItem("token");
}
