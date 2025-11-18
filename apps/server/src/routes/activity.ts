import { Router } from "express";

import { db } from "../db/index.js";

const router = Router();

router.get("/activity", (req, res) => {
  const limit = Number(req.query.limit ?? 50);
  const activity = [
    ...((db
      .prepare("SELECT id, name, createdAt, updatedAt FROM companies")
      .all() as Array<{ id: string; name: string; createdAt: string; updatedAt: string }>)
      .map((item) => ({
        entityType: "company",
        entityId: item.id,
        entityName: item.name,
        action: item.createdAt === item.updatedAt ? "created" : "updated",
        timestamp: item.updatedAt,
      }))),
    ...((db
      .prepare(
        `SELECT d.id, c.name as name, d.createdAt, d.updatedAt
         FROM deals d
         JOIN companies c ON c.id = d.companyId`,
      )
      .all() as Array<{ id: string; name: string; createdAt: string; updatedAt: string }>)
      .map((item) => ({
        entityType: "deal",
        entityId: item.id,
        entityName: item.name,
        action: item.createdAt === item.updatedAt ? "created" : "updated",
        timestamp: item.updatedAt,
      }))),
    ...((db
      .prepare("SELECT id, title as name, createdAt, completedAt FROM tasks")
      .all() as Array<{ id: string; name: string; createdAt: string; completedAt: string | null }>)
