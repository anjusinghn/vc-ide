import express from "express";
import cors from "cors";

import { migrate } from "./db/migrate.js";
import { seedIfEmpty } from "./db/seed.js";
import companiesRouter from "./routes/companies.js";
import dealsRouter from "./routes/deals.js";
import peopleRouter from "./routes/people.js";
import meetingsRouter from "./routes/meetings.js";
import memosRouter from "./routes/memos.js";
import thesesRouter from "./routes/theses.js";
import tasksRouter from "./routes/tasks.js";
import fundsRouter from "./routes/funds.js";
import pipelineRouter from "./routes/pipeline.js";
import searchRouter from "./routes/search.js";
import activityRouter from "./routes/activity.js";
import settingsRouter from "./routes/settings.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startedAt;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
});

app.use(
  cors({
    origin: ["http://localhost:1420", "http://localhost:5173"],
