import {
  loadThoughtsFromFile,
  prepareThoughtsForSerialization,
  saveThoughtsToFile
} from "./chunk-AXOTTHYV.js";
import {
  logger
} from "./chunk-USV7ZG3U.js";
import {
  ThoughtStage
} from "./chunk-J6X4GE65.js";

// src/storage/index.ts
import { promises as fs } from "fs";
import path from "path";
import { homedir } from "os";
var ThoughtStorage = class {
  storageDir;
  currentSessionFile;
  lockFile;
  thoughtHistory = [];
  constructor(storageDir) {
    if (storageDir) {
      this.storageDir = storageDir;
    } else {
      this.storageDir = path.join(homedir(), ".mcp_sequential_thinking");
    }
    this.currentSessionFile = path.join(this.storageDir, "current_session.json");
    this.lockFile = path.join(this.storageDir, "current_session.lock");
    this.loadSession();
  }
  async loadSession() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
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

export {
  ThoughtStorage
};
