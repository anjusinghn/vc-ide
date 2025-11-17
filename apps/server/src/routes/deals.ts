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
