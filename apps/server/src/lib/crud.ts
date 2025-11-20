import { Router } from "express";
import type Database from "better-sqlite3";

import { db } from "../db/index.js";
import { createId, nowIso, parseJsonFields, quoteIdentifier, stringifyJsonFields } from "./utils.js";

type CrudConfig = {
  table: string;
  entityName: string;
  requiredFields?: string[];
  filterableFields?: string[];
  jsonFields?: string[];
  createdAt?: boolean;
  updatedAt?: boolean;
  defaults?: Record<string, unknown>;
  afterRead?: (record: Record<string, unknown>) => Record<string, unknown>;
  onBeforeSave?: (record: Record<string, unknown>, mode: "create" | "update") => Record<string, unknown>;
  orderBy?: string;
};

function mapRecord(
  record: Record<string, unknown>,
  jsonFields: string[],
  afterRead?: CrudConfig["afterRead"],
) {
  const parsed = parseJsonFields(record, jsonFields);
  return afterRead ? afterRead(parsed) : parsed;
}

function insertRecord(database: Database.Database, table: string, record: Record<string, unknown>) {
  const columns = Object.keys(record);
  const columnSql = columns.map(quoteIdentifier).join(", ");
  const valueSql = columns.map((column) => `@${column}`).join(", ");
  database
    .prepare(`INSERT INTO ${quoteIdentifier(table)} (${columnSql}) VALUES (${valueSql})`)
    .run(record);
}

export function createCrudRouter(config: CrudConfig) {
  const router = Router();
  const {
    table,
    entityName,
    requiredFields = [],
    filterableFields = [],
    jsonFields = [],
    createdAt = true,
    updatedAt = true,
    defaults = {},
    afterRead,
    onBeforeSave,
    orderBy = "createdAt DESC",
  } = config;

  router.get(`/${table}`, (req, res) => {
    const filters = filterableFields.filter((field) => req.query[field] !== undefined);
    const whereClause =
