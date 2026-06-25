// import "./config/env.js";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes.js";
import { globalErrorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { apiLimiter } from "./middleware/rateLimit.js";
const app = express();
app.set("trust proxy", 1);
const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "https://workspaceos.vercel.app";
// ----- Security & parsers -----
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
}));
// ----- Routes -----
app.get("/", (_req, res) => res.send("API is running"));
app.use("/api/v1", apiLimiter, userRoutes);
// ----- 404 + error handler (must be last) -----
app.use(notFoundHandler);
app.use(globalErrorHandler);
// ----- DB & boot -----
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("MONGO_URI missing");
    process.exit(1);
}
mongoose
    .connect(mongoUri)
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
})
    .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map