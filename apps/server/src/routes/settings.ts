import { Router } from "express";

import { databasePath, db } from "../db/index.js";

const router = Router();

router.get("/settings", (_req, res) => {
  res.json({
    apiBase: "http://localhost:3001/api",
    dataPath: databasePath,
    productName: "Neuralyn",
    version: "0.1.0",
  });
});

router.post("/settings/clear-sample-data", (_req, res) => {
  const clearData = db.transaction(() => {
    db.prepare("DELETE FROM meetings").run();
    db.prepare("DELETE FROM memos").run();
    db.prepare("DELETE FROM tasks").run();
    db.prepare("DELETE FROM people").run();
    db.prepare("DELETE FROM deals").run();
    db.prepare("DELETE FROM theses").run();
    db.prepare("DELETE FROM funds").run();
    db.prepare("DELETE FROM companies").run();
  });

  clearData();
  res.status(204).send();
});

export default router;
