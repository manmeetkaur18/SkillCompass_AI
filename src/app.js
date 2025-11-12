import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
import careerRoutes from "./routes/careerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recommendationRoutes from "./routes/recommendationRoute.js";
import skillRoutes from "./routes/skillsRoutes.js";
import careerInsightsRoutes from "./routes/careerInsightsRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import recommendationHistoryRoutes from "./routes/recommendationHistoryRoutes.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(errorHandler);

app.use("/api/careers", careerRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/skills", recommendationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/insights", careerInsightsRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/recommendation", recommendationHistoryRoutes);

export default app;
