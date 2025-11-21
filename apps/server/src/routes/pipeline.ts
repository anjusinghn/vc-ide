import { Router } from "express";

import { db } from "../db/index.js";
import { parseJsonFields } from "../lib/utils.js";

const router = Router();

router.get("/pipeline/summary", (_req, res) => {
  const summary = {
    sourced: 0,
    first_call: 0,
    diligence: 0,
    ic: 0,
    term_sheet: 0,
    closed: 0,
    passed: 0,
  };

  const rows = db.prepare("SELECT stage, COUNT(*) as count FROM deals GROUP BY stage").all() as Array<{
    stage: keyof typeof summary;
    count: number;
  }>;

  for (const row of rows) {
    summary[row.stage] = row.count;
  }

  res.json(summary);
});

router.get("/pipeline/deals", (_req, res) => {
  const rows = db
    .prepare(
      `SELECT
        d.*,
        json_object(
          'id', c.id,
          'name', c.name,
          'sector', c.sector,
          'stage', c.stage,
          'geography', c.geography,
          'website', c.website,
          'description', c.description,
          'foundedDate', c.foundedDate,
          'employeeCount', c.employeeCount,
          'fundingTotal', c.fundingTotal,
          'createdAt', c.createdAt,
          'updatedAt', c.updatedAt
        ) AS company,
        CASE WHEN t.id IS NULL THEN NULL ELSE json_object(
          'id', t.id,
          'name', t.name,
