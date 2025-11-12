import { Router } from "express";

import { db } from "../db/index.js";
import { parseJsonFields } from "../lib/utils.js";

const router = Router();

router.get("/search", (req, res) => {
  const query = String(req.query.q ?? "").trim();

  if (!query) {
    res.json({ companies: [], people: [], deals: [] });
    return;
  }

  const like = `%${query}%`;
  const companies = db
    .prepare("SELECT * FROM companies WHERE name LIKE ? OR sector LIKE ? ORDER BY updatedAt DESC LIMIT 8")
    .all(like, like) as Record<string, unknown>[];
  const people = (
    db
      .prepare("SELECT * FROM people WHERE name LIKE ? OR role LIKE ? ORDER BY relationshipScore DESC LIMIT 8")
      .all(like, like) as Record<string, unknown>[]
  ).map((person) => parseJsonFields(person, ["tags"]));
  const deals = db
    .prepare(
      `SELECT
        d.*,
        json_object(
          'id', c.id,
          'name', c.name,
