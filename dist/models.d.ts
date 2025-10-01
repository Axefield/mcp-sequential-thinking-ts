import { z } from 'zod';

/**
 * Basic thinking stages for structured sequential thinking.
 */
declare enum ThoughtStage {
    PROBLEM_DEFINITION = "Problem Definition",
    RESEARCH = "Research",
    ANALYSIS = "Analysis",
    SYNTHESIS = "Synthesis",
    CONCLUSION = "Conclusion"
}
/**
 * Convert a string to a thinking stage.
 *
 * @param value - The string representation of the thinking stage
 * @returns The corresponding ThoughtStage enum value
 * @throws Error if the string does not match any valid thinking stage
 */
declare function thoughtStageFromString(value: string): ThoughtStage;
/**
 * Zod schema for ThoughtData validation
 */
declare const ThoughtDataSchema: z.ZodEffects<z.ZodObject<{
    thought: z.ZodString;
    thoughtNumber: z.ZodNumber;
    totalThoughts: z.ZodNumber;
    nextThoughtNeeded: z.ZodBoolean;
    stage: z.ZodNativeEnum<typeof ThoughtStage>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    axiomsUsed: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    assumptionsChallenged: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    timestamp: z.ZodDefault<z.ZodString>;
    id: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    stage: ThoughtStage;
    thought: string;
    thoughtNumber: number;
    totalThoughts: number;
    nextThoughtNeeded: boolean;
    tags: string[];
    axiomsUsed: string[];
    assumptionsChallenged: string[];
    timestamp: string;
    id: string;
}, {
    stage: ThoughtStage;
    thought: string;
    thoughtNumber: number;
    totalThoughts: number;
    nextThoughtNeeded: boolean;
    tags?: string[] | undefined;
    axiomsUsed?: string[] | undefined;
    assumptionsChallenged?: string[] | undefined;
    timestamp?: string | undefined;
    id?: string | undefined;
}>, {
    stage: ThoughtStage;
    thought: string;
    thoughtNumber: number;
    totalThoughts: number;
    nextThoughtNeeded: boolean;
    tags: string[];
    axiomsUsed: string[];
    assumptionsChallenged: string[];
    timestamp: string;
    id: string;
}, {
    stage: ThoughtStage;
    thought: string;
    thoughtNumber: number;
    totalThoughts: number;
    nextThoughtNeeded: boolean;
    tags?: string[] | undefined;
    axiomsUsed?: string[] | undefined;
    assumptionsChallenged?: string[] | undefined;
    timestamp?: string | undefined;
    id?: string | undefined;
}>;
/**
 * Inferred type from ThoughtDataSchema
 */
type ThoughtData = z.infer<typeof ThoughtDataSchema>;
/**
 * Data structure for a single thought in the sequential thinking process.
 */
declare class ThoughtDataClass {
    readonly thought: string;
    readonly thoughtNumber: number;
    readonly totalThoughts: number;
    readonly nextThoughtNeeded: boolean;
    readonly stage: ThoughtStage;
    readonly tags: string[];
    readonly axiomsUsed: string[];
    readonly assumptionsChallenged: string[];
    readonly timestamp: string;
    readonly id: string;
    constructor(data: Partial<ThoughtData> & {
        thought: string;
        thoughtNumber: number;
        totalThoughts: number;
        nextThoughtNeeded: boolean;
        stage: ThoughtStage;
    });
    /**
     * Legacy validation method for backward compatibility.
     *
     * @returns True if the thought data is valid
     */
    validate(): boolean;
    /**
     * Convert the thought data to a dictionary representation.
     *
     * @param includeId - Whether to include the ID in the dictionary representation.
     *                    Default is false to maintain compatibility with tests.
     * @returns Dictionary representation of the thought data
     */
    toDict(includeId?: boolean): Record<string, any>;
    /**
     * Create a ThoughtDataClass instance from a dictionary.
     *
     * @param data - Dictionary containing thought data
     * @returns A new ThoughtDataClass instance
     */
    static fromDict(data: Record<string, any>): ThoughtDataClass;
    /**
     * Check equality with another ThoughtDataClass based on ID
     */
    equals(other: ThoughtDataClass): boolean;
    /**
     * Get hash code for the thought data based on ID
     */
    hashCode(): number;
}

export { type ThoughtData, ThoughtDataClass, ThoughtDataSchema, ThoughtStage, thoughtStageFromString };
