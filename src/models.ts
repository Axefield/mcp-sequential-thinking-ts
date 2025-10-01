import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

/**
 * Basic thinking stages for structured sequential thinking.
 */
export enum ThoughtStage {
  PROBLEM_DEFINITION = 'Problem Definition',
  RESEARCH = 'Research',
  ANALYSIS = 'Analysis',
  SYNTHESIS = 'Synthesis',
  CONCLUSION = 'Conclusion',
}

/**
 * Convert a string to a thinking stage.
 * 
 * @param value - The string representation of the thinking stage
 * @returns The corresponding ThoughtStage enum value
 * @throws Error if the string does not match any valid thinking stage
 */
export function thoughtStageFromString(value: string): ThoughtStage {
  // Case-insensitive comparison
  const normalizedValue = value.toLowerCase();
  for (const stage of Object.values(ThoughtStage)) {
    if (stage.toLowerCase() === normalizedValue) {
      return stage;
    }
  }

  // If no match found
  const validStages = Object.values(ThoughtStage).join(', ');
  throw new Error(`Invalid thinking stage: '${value}'. Valid stages are: ${validStages}`);
}

/**
 * Zod schema for ThoughtData validation
 */
export const ThoughtDataSchema = z.object({
  thought: z.string().min(1, 'Thought content cannot be empty').trim(),
  thoughtNumber: z.number().int().min(1, 'Thought number must be positive'),
  totalThoughts: z.number().int().min(1, 'Total thoughts must be positive'),
  nextThoughtNeeded: z.boolean(),
  stage: z.nativeEnum(ThoughtStage),
  tags: z.array(z.string()).default([]),
  axiomsUsed: z.array(z.string()).default([]),
  assumptionsChallenged: z.array(z.string()).default([]),
  timestamp: z.string().default(() => new Date().toISOString()),
  id: z.string().uuid().default(() => uuidv4()),
}).refine(
  (data) => data.totalThoughts >= data.thoughtNumber,
  {
    message: 'Total thoughts must be greater or equal to current thought number',
    path: ['totalThoughts'],
  }
);

/**
 * Inferred type from ThoughtDataSchema
 */
export type ThoughtData = z.infer<typeof ThoughtDataSchema>;

/**
 * Data structure for a single thought in the sequential thinking process.
 */
export class ThoughtDataClass {
  public readonly thought: string;
  public readonly thoughtNumber: number;
  public readonly totalThoughts: number;
  public readonly nextThoughtNeeded: boolean;
  public readonly stage: ThoughtStage;
  public readonly tags: string[];
  public readonly axiomsUsed: string[];
  public readonly assumptionsChallenged: string[];
  public readonly timestamp: string;
  public readonly id: string;

  constructor(data: Partial<ThoughtData> & { thought: string; thoughtNumber: number; totalThoughts: number; nextThoughtNeeded: boolean; stage: ThoughtStage }) {
    // Validate the data using the schema
    const validated = ThoughtDataSchema.parse({
      thought: data.thought,
      thoughtNumber: data.thoughtNumber,
      totalThoughts: data.totalThoughts,
      nextThoughtNeeded: data.nextThoughtNeeded,
      stage: data.stage,
      tags: data.tags ?? [],
      axiomsUsed: data.axiomsUsed ?? [],
      assumptionsChallenged: data.assumptionsChallenged ?? [],
      timestamp: data.timestamp ?? new Date().toISOString(),
      id: data.id ?? uuidv4(),
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
  validate(): boolean {
    // Validation is now handled by Zod automatically
    return true;
  }

  /**
   * Convert the thought data to a dictionary representation.
   * 
   * @param includeId - Whether to include the ID in the dictionary representation.
   *                    Default is false to maintain compatibility with tests.
   * @returns Dictionary representation of the thought data
   */
  toDict(includeId = false): Record<string, any> {
    const data: Record<string, any> = {
      thought: this.thought,
      thoughtNumber: this.thoughtNumber,
      totalThoughts: this.totalThoughts,
      nextThoughtNeeded: this.nextThoughtNeeded,
      stage: this.stage,
      tags: this.tags,
      axiomsUsed: this.axiomsUsed,
      assumptionsChallenged: this.assumptionsChallenged,
      timestamp: this.timestamp,
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
  static fromDict(data: Record<string, any>): ThoughtDataClass {
    // Convert any camelCase keys to snake_case for internal processing
    const normalizedData: Record<string, any> = {
      thought: data.thought,
      thoughtNumber: data.thoughtNumber ?? data.thought_number,
      totalThoughts: data.totalThoughts ?? data.total_thoughts,
      nextThoughtNeeded: data.nextThoughtNeeded ?? data.next_thought_needed,
      stage: typeof data.stage === 'string' ? thoughtStageFromString(data.stage) : data.stage,
      tags: data.tags ?? [],
      axiomsUsed: data.axiomsUsed ?? data.axioms_used ?? [],
      assumptionsChallenged: data.assumptionsChallenged ?? data.assumptions_challenged ?? [],
      timestamp: data.timestamp ?? new Date().toISOString(),
      id: data.id ?? uuidv4(),
    };

    return new ThoughtDataClass(normalizedData);
  }

  /**
   * Check equality with another ThoughtDataClass based on ID
   */
  equals(other: ThoughtDataClass): boolean {
    return this.id === other.id;
  }

  /**
   * Get hash code for the thought data based on ID
   */
  hashCode(): number {
    return this.id.split('').reduce((hash, char) => {
      return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
    }, 0);
  }
}
