import express from "express";
import cors from "cors";
import linkedinRoutes from "./routes/linkedin.js";
import naukriRoutes from "./routes/naukri.js";
import resumeRoutes from "./routes/resume.js";
import naukriUpdateRoutes from "./routes/naukri-update.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/linkedin", linkedinRoutes);
app.use("/api/naukri", naukriRoutes);
app.use("/api/naukri", naukriUpdateRoutes);
app.use("/api/resume", resumeRoutes);

export default app;
