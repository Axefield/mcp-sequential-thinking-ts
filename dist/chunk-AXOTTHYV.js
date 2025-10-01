import {
  logger
} from "./chunk-USV7ZG3U.js";
import {
  ThoughtDataClass
} from "./chunk-J6X4GE65.js";

// src/storage/utils.ts
import { promises as fs } from "fs";
import lockfile from "proper-lockfile";
function prepareThoughtsForSerialization(thoughts) {
  return thoughts.map((thought) => thought.toDict(true));
}
async function saveThoughtsToFile(filePath, thoughts, lockFilePath, metadata) {
  const data = {
    thoughts,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    ...metadata
  };
  const release = await lockfile.lock(lockFilePath, {
    realpath: false,
    retries: { retries: 5, minTimeout: 100, maxTimeout: 1e3 }
  });
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    logger.debug(`Saved ${thoughts.length} thoughts to ${filePath}`);
  } finally {
    await release();
  }
}
async function loadThoughtsFromFile(filePath, lockFilePath) {
  try {
    await fs.access(filePath);
  } catch {
    return [];
  }
  try {
    const release = await lockfile.lock(lockFilePath, {
      realpath: false,
      retries: { retries: 5, minTimeout: 100, maxTimeout: 1e3 }
    });
    try {
      const content = await fs.readFile(filePath, "utf8");
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
    await fs.rename(filePath, backupFile);
    logger.info(`Created backup of corrupted file at ${backupFile}`);
    return [];
  }
}

export {
  prepareThoughtsForSerialization,
  saveThoughtsToFile,
  loadThoughtsFromFile
};
