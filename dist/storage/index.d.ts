import { ThoughtDataClass, ThoughtStage } from '../models.js';
import 'zod';

/**
 * Storage manager for thought data.
 */
declare class ThoughtStorage {
    private readonly storageDir;
    private readonly currentSessionFile;
    private readonly lockFile;
    private thoughtHistory;
    constructor(storageDir?: string);
    /**
     * Initialize the storage by loading existing session.
     * This should be called after construction.
     */
    initialize(): Promise<void>;
    private loadSession;
    private saveSession;
    /**
     * Add a thought to the history and save the session.
     *
     * @param thought - The thought data to add
     */
    addThought(thought: ThoughtDataClass): Promise<void>;
    /**
     * Get all thoughts in the current session.
     *
     * @returns All thoughts in the current session
     */
    getAllThoughts(): ThoughtDataClass[];
    /**
     * Get all thoughts in a specific stage.
     *
     * @param stage - The thinking stage to filter by
     * @returns Thoughts in the specified stage
     */
    getThoughtsByStage(stage: ThoughtStage): ThoughtDataClass[];
    /**
     * Clear the thought history and save the empty session.
     */
    clearHistory(): Promise<void>;
    /**
     * Export the current session to a file.
     *
     * @param filePath - Path to save the exported session
     */
    exportSession(filePath: string): Promise<void>;
    /**
     * Import a session from a file.
     *
     * @param filePath - Path to the file to import
     * @throws Error if the file doesn't exist or is not valid JSON
     */
    importSession(filePath: string): Promise<void>;
}

export { ThoughtStorage };
