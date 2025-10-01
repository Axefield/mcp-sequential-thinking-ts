import { ThoughtDataClass } from './models.cjs';
import 'zod';

/**
 * Analyzer for thought data to extract insights and patterns.
 */
declare class ThoughtAnalyzer {
    /**
     * Find thoughts related to the current thought.
     *
     * @param currentThought - The current thought to find related thoughts for
     * @param allThoughts - All available thoughts to search through
     * @param maxResults - Maximum number of related thoughts to return
     * @returns Related thoughts, sorted by relevance
     */
    static findRelatedThoughts(currentThought: ThoughtDataClass, allThoughts: ThoughtDataClass[], maxResults?: number): Promise<ThoughtDataClass[]>;
    /**
     * Generate a summary of the thinking process.
     *
     * @param thoughts - List of thoughts to summarize
     * @returns Summary data
     */
    static generateSummary(thoughts: ThoughtDataClass[]): Record<string, any>;
    /**
     * Analyze a single thought in the context of all thoughts.
     *
     * @param thought - The thought to analyze
     * @param allThoughts - All available thoughts for context
     * @returns Analysis results
     */
    static analyzeThought(thought: ThoughtDataClass, allThoughts: ThoughtDataClass[]): Promise<Record<string, any>>;
}

export { ThoughtAnalyzer };
