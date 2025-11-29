import { Router } from "express";

import { db } from "../db/index.js";
import { createCrudRouter } from "../lib/crud.js";
import { parseJsonFields } from "../lib/utils.js";

const router = Router();

router.get("/deals/:id/full", (req, res) => {
  const row = db
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
        CASE WHEN f.id IS NULL THEN NULL ELSE json_object(
          'id', f.id,
          'name', f.name,
          'vintageYear', f.vintageYear,
          'targetSize', f.targetSize,
          'strategy', f.strategy,
          'createdAt', f.createdAt
        ) END AS fund,
        CASE WHEN t.id IS NULL THEN NULL ELSE json_object(
          'id', t.id,
          'name', t.name,
          'fundId', t.fundId,
          'sectors', t.sectors,
          'stages', t.stages,
          'geographies', t.geographies,
          'ownershipTargetMin', t.ownershipTargetMin,
          'ownershipTargetMax', t.ownershipTargetMax,
          'preferredFounderPatterns', t.preferredFounderPatterns,
          'antiPatterns', t.antiPatterns,
          'diligenceQuestions', t.diligenceQuestions,
          'active', t.active,
          'createdAt', t.createdAt,
          'updatedAt', t.updatedAt
        ) END AS thesis
      FROM deals d
      JOIN companies c ON c.id = d.companyId
      LEFT JOIN funds f ON f.id = d.fundId
      LEFT JOIN theses t ON t.id = d.thesisId
      WHERE d.id = ?`,
    )
    .get(req.params.id) as Record<string, unknown> | undefined;

  if (!row) {
    res.status(404).json({ error: "Deal not found" });
    return;
  }

  const company = JSON.parse(String(row.company));
  const fund = row.fund ? JSON.parse(String(row.fund)) : null;
  const thesis = row.thesis ? parseJsonFields(JSON.parse(String(row.thesis)), [
    "sectors",
    "stages",
    "geographies",
    "preferredFounderPatterns",
    "antiPatterns",
    "diligenceQuestions",
  ]) : null;

  const meetings = (
    db.prepare("SELECT * FROM meetings WHERE dealId = ? ORDER BY date DESC").all(req.params.id) as Record<
      string,
      unknown
    >[]
  ).map((item) => parseJsonFields(item, ["attendees", "structuredNotes"]));

  const memos = db
    .prepare("SELECT * FROM memos WHERE dealId = ? ORDER BY updatedAt DESC")
    .all(req.params.id) as Record<string, unknown>[];

  const tasks = db
    .prepare("SELECT * FROM tasks WHERE dealId = ? ORDER BY CASE status WHEN 'open' THEN 0 ELSE 1 END, dueDate ASC")
    .all(req.params.id) as Record<string, unknown>[];

  const people = db
    .prepare(
      `SELECT p.*
       FROM people p
       WHERE p.companyId = ? OR p.id IN (
         SELECT value FROM json_each(
           COALESCE((SELECT attendees FROM meetings WHERE dealId = ? ORDER BY date DESC LIMIT 1), '[]')
         )
       )
       ORDER BY p.relationshipScore DESC`,
    )
    .all(row.companyId, req.params.id) as Record<string, unknown>[];

  const activity = [
    ...meetings.map((meeting) => ({
      entityType: "meeting",
      entityId: String(meeting.id),
      entityName: String(meeting.meetingType),
