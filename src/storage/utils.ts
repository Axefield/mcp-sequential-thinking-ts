import { promises as fs } from 'fs';
import path from 'path';
import lockfile from 'proper-lockfile';
import { ThoughtDataClass } from '../models.js';
import { logger } from '../logging.js';

/**
 * Prepare thoughts for serialization with IDs included.
 * 
 * @param thoughts - List of thought data objects to prepare
 * @returns List of thought dictionaries with IDs
 */
export function prepareThoughtsForSerialization(thoughts: ThoughtDataClass[]): Record<string, any>[] {
  return thoughts.map(thought => thought.toDict(true));
}

/**
 * Save thoughts to a file with proper locking.
 * 
 * @param filePath - Path to the file to save
 * @param thoughts - List of thought dictionaries to save
 * @param lockFilePath - Path to the lock file
 * @param metadata - Optional additional metadata to include
 */
export async function saveThoughtsToFile(
  filePath: string, 
  thoughts: Record<string, any>[], 
  lockFilePath: string, 
  metadata?: Record<string, any>
): Promise<void> {
  const data = {
    thoughts,
    lastUpdated: new Date().toISOString(),
    ...metadata,
  };
  
  // Use file locking to ensure thread safety when writing
  const release = await lockfile.lock(lockFilePath, { 
    realpath: false, 
    retries: { retries: 5, minTimeout: 100, maxTimeout: 1000 } 
  });
  
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    logger.debug(`Saved ${thoughts.length} thoughts to ${filePath}`);
  } finally {
    await release();
  }
}

/**
 * Load thoughts from a file with proper locking.
 * 
 * @param filePath - Path to the file to load
 * @param lockFilePath - Path to the lock file
 * @returns Loaded thought data objects
 * @throws Error if the file is not valid JSON or doesn't contain valid thought data
 */
export async function loadThoughtsFromFile(filePath: string, lockFilePath: string): Promise<ThoughtDataClass[]> {
  try {
    await fs.access(filePath);
  } catch {
    // File doesn't exist, return empty array
    return [];
  }
    
  try {
    const release = await lockfile.lock(lockFilePath, { 
      realpath: false, 
      retries: { retries: 5, minTimeout: 100, maxTimeout: 1000 } 
    });
    
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // Convert data to ThoughtDataClass objects
      const thoughts = (data.thoughts || []).map((thoughtDict: any) => 
        ThoughtDataClass.fromDict(thoughtDict)
      );
          
      logger.debug(`Loaded ${thoughts.length} thoughts from ${filePath}`);
      return thoughts;
    } finally {
      await release();
    }
  } catch (error) {
    // Handle corrupted file
    logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, `Error loading from ${filePath}:`);
    
    // Create backup of corrupted file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `${filePath}.bak.${timestamp}`;
    await fs.rename(filePath, backupFile);
    logger.info(`Created backup of corrupted file at ${backupFile}`);
    return [];
  }
}
