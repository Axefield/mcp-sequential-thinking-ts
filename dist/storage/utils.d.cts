import { ThoughtDataClass } from '../models.cjs';
import 'zod';

/**
 * Prepare thoughts for serialization with IDs included.
 *
 * @param thoughts - List of thought data objects to prepare
 * @returns List of thought dictionaries with IDs
 */
declare function prepareThoughtsForSerialization(thoughts: ThoughtDataClass[]): Record<string, any>[];
/**
 * Save thoughts to a file with proper locking.
 *
 * @param filePath - Path to the file to save
 * @param thoughts - List of thought dictionaries to save
 * @param lockFilePath - Path to the lock file
 * @param metadata - Optional additional metadata to include
 */
declare function saveThoughtsToFile(filePath: string, thoughts: Record<string, any>[], lockFilePath: string, metadata?: Record<string, any>): Promise<void>;
/**
 * Load thoughts from a file with proper locking.
 *
 * @param filePath - Path to the file to load
 * @param lockFilePath - Path to the lock file
 * @returns Loaded thought data objects
 * @throws Error if the file is not valid JSON or doesn't contain valid thought data
 */
declare function loadThoughtsFromFile(filePath: string, lockFilePath: string): Promise<ThoughtDataClass[]>;

export { loadThoughtsFromFile, prepareThoughtsForSerialization, saveThoughtsToFile };
