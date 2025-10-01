"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/storage/index.ts
var storage_exports = {};
__export(storage_exports, {
  ThoughtStorage: () => ThoughtStorage
});
module.exports = __toCommonJS(storage_exports);
var import_fs2 = require("fs");
var import_path = __toESM(require("path"), 1);
var import_os = require("os");

// src/models.ts
var import_zod = require("zod");
var import_uuid = require("uuid");
var ThoughtStage = /* @__PURE__ */ ((ThoughtStage2) => {
  ThoughtStage2["PROBLEM_DEFINITION"] = "Problem Definition";
  ThoughtStage2["RESEARCH"] = "Research";
  ThoughtStage2["ANALYSIS"] = "Analysis";
  ThoughtStage2["SYNTHESIS"] = "Synthesis";
  ThoughtStage2["CONCLUSION"] = "Conclusion";
  return ThoughtStage2;
})(ThoughtStage || {});
function thoughtStageFromString(value) {
  const normalizedValue = value.toLowerCase();
  for (const stage of Object.values(ThoughtStage)) {
    if (stage.toLowerCase() === normalizedValue) {
      return stage;
    }
  }
  const validStages = Object.values(ThoughtStage).join(", ");
  throw new Error(`Invalid thinking stage: '${value}'. Valid stages are: ${validStages}`);
}
var ThoughtDataSchema = import_zod.z.object({
  thought: import_zod.z.string().min(1, "Thought content cannot be empty").trim(),
  thoughtNumber: import_zod.z.number().int().min(1, "Thought number must be positive"),
  totalThoughts: import_zod.z.number().int().min(1, "Total thoughts must be positive"),
  nextThoughtNeeded: import_zod.z.boolean(),
  stage: import_zod.z.nativeEnum(ThoughtStage),
  tags: import_zod.z.array(import_zod.z.string()).default([]),
  axiomsUsed: import_zod.z.array(import_zod.z.string()).default([]),
  assumptionsChallenged: import_zod.z.array(import_zod.z.string()).default([]),
  timestamp: import_zod.z.string().default(() => (/* @__PURE__ */ new Date()).toISOString()),
  id: import_zod.z.string().uuid().default(() => (0, import_uuid.v4)())
}).refine(
  (data) => data.totalThoughts >= data.thoughtNumber,
  {
    message: "Total thoughts must be greater or equal to current thought number",
    path: ["totalThoughts"]
  }
);
var ThoughtDataClass = class _ThoughtDataClass {
  thought;
  thoughtNumber;
  totalThoughts;
  nextThoughtNeeded;
  stage;
  tags;
  axiomsUsed;
  assumptionsChallenged;
  timestamp;
  id;
  constructor(data) {
    const validated = ThoughtDataSchema.parse({
      thought: data.thought,
      thoughtNumber: data.thoughtNumber,
      totalThoughts: data.totalThoughts,
      nextThoughtNeeded: data.nextThoughtNeeded,
      stage: data.stage,
      tags: data.tags ?? [],
      axiomsUsed: data.axiomsUsed ?? [],
      assumptionsChallenged: data.assumptionsChallenged ?? [],
      timestamp: data.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      id: data.id ?? (0, import_uuid.v4)()
    });
    this.thought = validated.thought;
    this.thoughtNumber = validated.thoughtNumber;
    this.totalThoughts = validated.totalThoughts;
    this.nextThoughtNeeded = validated.nextThoughtNeeded;
    this.stage = validated.stage;
    this.tags = validated.tags;
    this.axiomsUsed = validated.axiomsUsed;
    this.assumptionsChallenged = validated.assumptionsChallenged;
    this.timestamp = validated.timestamp;
    this.id = validated.id;
  }
  /**
   * Legacy validation method for backward compatibility.
   * 
   * @returns True if the thought data is valid
   */
  validate() {
    return true;
  }
  /**
   * Convert the thought data to a dictionary representation.
   * 
   * @param includeId - Whether to include the ID in the dictionary representation.
   *                    Default is false to maintain compatibility with tests.
   * @returns Dictionary representation of the thought data
   */
  toDict(includeId = false) {
    const data = {
      thought: this.thought,
      thoughtNumber: this.thoughtNumber,
      totalThoughts: this.totalThoughts,
      nextThoughtNeeded: this.nextThoughtNeeded,
      stage: this.stage,
      tags: this.tags,
      axiomsUsed: this.axiomsUsed,
      assumptionsChallenged: this.assumptionsChallenged,
      timestamp: this.timestamp
    };
    if (includeId) {
      data.id = this.id;
    }
    return data;
  }
  /**
   * Create a ThoughtDataClass instance from a dictionary.
   * 
   * @param data - Dictionary containing thought data
   * @returns A new ThoughtDataClass instance
   */
  static fromDict(data) {
    const normalizedData = {
      thought: data.thought,
      thoughtNumber: data.thoughtNumber ?? data.thought_number,
      totalThoughts: data.totalThoughts ?? data.total_thoughts,
      nextThoughtNeeded: data.nextThoughtNeeded ?? data.next_thought_needed,
      stage: typeof data.stage === "string" ? thoughtStageFromString(data.stage) : data.stage,
      tags: data.tags ?? [],
      axiomsUsed: data.axiomsUsed ?? data.axioms_used ?? [],
      assumptionsChallenged: data.assumptionsChallenged ?? data.assumptions_challenged ?? [],
      timestamp: data.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      id: data.id ?? (0, import_uuid.v4)()
    };
    return new _ThoughtDataClass(normalizedData);
  }
  /**
   * Check equality with another ThoughtDataClass based on ID
   */
  equals(other) {
    return this.id === other.id;
  }
  /**
   * Get hash code for the thought data based on ID
   */
  hashCode() {
    return this.id.split("").reduce((hash, char) => {
      return (hash << 5) - hash + char.charCodeAt(0) & 4294967295;
    }, 0);
  }
};

// src/logging.ts
var import_pino = __toESM(require("pino"), 1);
var logger = (0, import_pino.default)({
  level: process.env.LOG_LEVEL ?? "info",
  transport: process.env.NODE_ENV === "production" ? void 0 : {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss.l",
      ignore: "pid,hostname"
    }
  }
});

// src/storage/utils.ts
var import_fs = require("fs");
var import_proper_lockfile = __toESM(require("proper-lockfile"), 1);
function prepareThoughtsForSerialization(thoughts) {
  return thoughts.map((thought) => thought.toDict(true));
}
async function saveThoughtsToFile(filePath, thoughts, lockFilePath, metadata) {
  const data = {
    thoughts,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    ...metadata
  };
  const release = await import_proper_lockfile.default.lock(lockFilePath, {
    realpath: false,
    retries: { retries: 5, minTimeout: 100, maxTimeout: 1e3 }
  });
  try {
    await import_fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    logger.debug(`Saved ${thoughts.length} thoughts to ${filePath}`);
  } finally {
    await release();
  }
}
async function loadThoughtsFromFile(filePath, lockFilePath) {
  try {
    await import_fs.promises.access(filePath);
  } catch {
    return [];
  }
  try {
    const release = await import_proper_lockfile.default.lock(lockFilePath, {
      realpath: false,
      retries: { retries: 5, minTimeout: 100, maxTimeout: 1e3 }
    });
    try {
      const content = await import_fs.promises.readFile(filePath, "utf8");
      const data = JSON.parse(content);
      const thoughts = (data.thoughts || []).map(
        (thoughtDict) => ThoughtDataClass.fromDict(thoughtDict)
      );
      logger.debug(`Loaded ${thoughts.length} thoughts from ${filePath}`);
      return thoughts;
    } finally {
      await release();
    }
  } catch (error) {
    logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, `Error loading from ${filePath}:`);
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const backupFile = `${filePath}.bak.${timestamp}`;
    await import_fs.promises.rename(filePath, backupFile);
    logger.info(`Created backup of corrupted file at ${backupFile}`);
    return [];
  }
}

// src/storage/index.ts
var ThoughtStorage = class {
  storageDir;
  currentSessionFile;
  lockFile;
  thoughtHistory = [];
  constructor(storageDir) {
    if (storageDir) {
      this.storageDir = storageDir;
    } else {
      this.storageDir = import_path.default.join((0, import_os.homedir)(), ".mcp_sequential_thinking");
    }
    this.currentSessionFile = import_path.default.join(this.storageDir, "current_session.json");
    this.lockFile = import_path.default.join(this.storageDir, "current_session.lock");
    this.thoughtHistory = [];
  }
  /**
   * Initialize the storage by loading existing session.
   * This should be called after construction.
   */
  async initialize() {
    await this.loadSession();
  }
  async loadSession() {
    try {
      await import_fs2.promises.mkdir(this.storageDir, { recursive: true });
      this.thoughtHistory = await loadThoughtsFromFile(this.currentSessionFile, this.lockFile);
    } catch (error) {
      logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, "Error loading session:");
      this.thoughtHistory = [];
    }
  }
  async saveSession() {
    try {
      const thoughtsWithIds = prepareThoughtsForSerialization(this.thoughtHistory);
      await saveThoughtsToFile(this.currentSessionFile, thoughtsWithIds, this.lockFile);
    } catch (error) {
      logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, "Error saving session:");
      throw error;
    }
  }
  /**
   * Add a thought to the history and save the session.
   * 
   * @param thought - The thought data to add
   */
  async addThought(thought) {
    this.thoughtHistory.push(thought);
    await this.saveSession();
  }
  /**
   * Get all thoughts in the current session.
   * 
   * @returns All thoughts in the current session
   */
  getAllThoughts() {
    return [...this.thoughtHistory];
  }
  /**
   * Get all thoughts in a specific stage.
   * 
   * @param stage - The thinking stage to filter by
   * @returns Thoughts in the specified stage
   */
  getThoughtsByStage(stage) {
    return this.thoughtHistory.filter((t) => t.stage === stage);
  }
  /**
   * Clear the thought history and save the empty session.
   */
  async clearHistory() {
    this.thoughtHistory = [];
    await this.saveSession();
  }
  /**
   * Export the current session to a file.
   * 
   * @param filePath - Path to save the exported session
   */
  async exportSession(filePath) {
    const thoughtsWithIds = prepareThoughtsForSerialization(this.thoughtHistory);
    const metadata = {
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      metadata: {
        totalThoughts: this.thoughtHistory.length,
        stages: Object.values(ThoughtStage).reduce((acc, stage) => {
          acc[stage] = this.thoughtHistory.filter((t) => t.stage === stage).length;
          return acc;
        }, {})
      }
    };
    const lockFilePath = filePath.replace(/\.json$/, ".lock");
    await saveThoughtsToFile(filePath, thoughtsWithIds, lockFilePath, metadata);
  }
  /**
   * Import a session from a file.
   * 
   * @param filePath - Path to the file to import
   * @throws Error if the file doesn't exist or is not valid JSON
   */
  async importSession(filePath) {
    const lockFilePath = filePath.replace(/\.json$/, ".lock");
    const thoughts = await loadThoughtsFromFile(filePath, lockFilePath);
    this.thoughtHistory = thoughts;
    await this.saveSession();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ThoughtStorage
});
