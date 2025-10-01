import { promises as fs } from 'fs';
import path from 'path';
import { homedir } from 'os';
import { ThoughtDataClass, ThoughtStage } from '../models.js';
import { logger } from '../logging.js';
import { 
  prepareThoughtsForSerialization, 
  saveThoughtsToFile, 
  loadThoughtsFromFile 
} from './utils.js';

/**
 * Storage manager for thought data.
 */
export class ThoughtStorage {
  private readonly storageDir: string;
  private readonly currentSessionFile: string;
  private readonly lockFile: string;
  private thoughtHistory: ThoughtDataClass[] = [];

  constructor(storageDir?: string) {
    if (storageDir) {
      this.storageDir = storageDir;
    } else {
      // Use user's home directory by default
      this.storageDir = path.join(homedir(), '.mcp_sequential_thinking');
    }

    this.currentSessionFile = path.join(this.storageDir, 'current_session.json');
    this.lockFile = path.join(this.storageDir, 'current_session.lock');

    // Initialize thoughtHistory as empty array
    this.thoughtHistory = [];
  }

  /**
   * Initialize the storage by loading existing session.
   * This should be called after construction.
   */
  async initialize(): Promise<void> {
    await this.loadSession();
  }

  private async loadSession(): Promise<void> {
    try {
      // Ensure storage directory exists
      await fs.mkdir(this.storageDir, { recursive: true });
      
      // Use the utility function to handle loading with proper error handling
      this.thoughtHistory = await loadThoughtsFromFile(this.currentSessionFile, this.lockFile);
    } catch (error) {
      logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, 'Error loading session:');
      this.thoughtHistory = [];
    }
  }

  private async saveSession(): Promise<void> {
    try {
      // Use utility functions to prepare and save thoughts
      const thoughtsWithIds = prepareThoughtsForSerialization(this.thoughtHistory);
      
      // Save to file with proper locking
      await saveThoughtsToFile(this.currentSessionFile, thoughtsWithIds, this.lockFile);
    } catch (error) {
      logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, 'Error saving session:');
      throw error;
    }
  }

  /**
   * Add a thought to the history and save the session.
   * 
   * @param thought - The thought data to add
   */
  async addThought(thought: ThoughtDataClass): Promise<void> {
    this.thoughtHistory.push(thought);
    await this.saveSession();
  }

  /**
   * Get all thoughts in the current session.
   * 
   * @returns All thoughts in the current session
   */
  getAllThoughts(): ThoughtDataClass[] {
    // Return a copy to avoid external modification
    return [...this.thoughtHistory];
  }

  /**
   * Get all thoughts in a specific stage.
   * 
   * @param stage - The thinking stage to filter by
   * @returns Thoughts in the specified stage
   */
  getThoughtsByStage(stage: ThoughtStage): ThoughtDataClass[] {
    return this.thoughtHistory.filter(t => t.stage === stage);
  }

  /**
   * Clear the thought history and save the empty session.
   */
  async clearHistory(): Promise<void> {
    this.thoughtHistory = [];
    await this.saveSession();
  }

  /**
   * Export the current session to a file.
   * 
   * @param filePath - Path to save the exported session
   */
  async exportSession(filePath: string): Promise<void> {
    // Use utility function to prepare thoughts for serialization
    const thoughtsWithIds = prepareThoughtsForSerialization(this.thoughtHistory);
    
    // Create export-specific metadata
    const metadata = {
      exportedAt: new Date().toISOString(),
      metadata: {
        totalThoughts: this.thoughtHistory.length,
        stages: Object.values(ThoughtStage).reduce((acc, stage) => {
          acc[stage] = this.thoughtHistory.filter(t => t.stage === stage).length;
          return acc;
        }, {} as Record<string, number>),
      },
    };

    const lockFilePath = filePath.replace(/\.json$/, '.lock');
    
    // Use utility function to save with proper locking
    await saveThoughtsToFile(filePath, thoughtsWithIds, lockFilePath, metadata);
  }

  /**
   * Import a session from a file.
   * 
   * @param filePath - Path to the file to import
   * @throws Error if the file doesn't exist or is not valid JSON
   */
  async importSession(filePath: string): Promise<void> {
    const lockFilePath = filePath.replace(/\.json$/, '.lock');
    
    // Use utility function to load thoughts with proper error handling
    const thoughts = await loadThoughtsFromFile(filePath, lockFilePath);
    
    this.thoughtHistory = thoughts;
    await this.saveSession();
  }
}
