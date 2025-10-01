import { describe, it, expect } from 'vitest';
import { ThoughtStage, thoughtStageFromString, ThoughtDataClass } from '../src/models.js';

describe('ThoughtStage', () => {
  it('should convert valid strings to ThoughtStage enum values', () => {
    expect(thoughtStageFromString('Problem Definition')).toBe(ThoughtStage.PROBLEM_DEFINITION);
    expect(thoughtStageFromString('Research')).toBe(ThoughtStage.RESEARCH);
    expect(thoughtStageFromString('Analysis')).toBe(ThoughtStage.ANALYSIS);
    expect(thoughtStageFromString('Synthesis')).toBe(ThoughtStage.SYNTHESIS);
    expect(thoughtStageFromString('Conclusion')).toBe(ThoughtStage.CONCLUSION);
  });

  it('should handle case-insensitive conversion', () => {
    expect(thoughtStageFromString('problem definition')).toBe(ThoughtStage.PROBLEM_DEFINITION);
    expect(thoughtStageFromString('RESEARCH')).toBe(ThoughtStage.RESEARCH);
  });

  it('should throw error for invalid strings', () => {
    expect(() => thoughtStageFromString('Invalid Stage')).toThrow('Invalid thinking stage');
  });
});

describe('ThoughtDataClass', () => {
  it('should validate valid thought data', () => {
    const thought = new ThoughtDataClass({
      thought: 'Test thought',
      thoughtNumber: 1,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    });
    expect(thought.validate()).toBe(true);
  });

  it('should throw error for invalid thought number', () => {
    expect(() => new ThoughtDataClass({
      thought: 'Test thought',
      thoughtNumber: 0, // Invalid: must be positive
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    })).toThrow('Thought number must be positive');
  });

  it('should throw error for invalid total thoughts', () => {
    expect(() => new ThoughtDataClass({
      thought: 'Test thought',
      thoughtNumber: 3,
      totalThoughts: 2, // Invalid: less than thought_number
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    })).toThrow('Total thoughts must be greater or equal to current thought number');
  });

  it('should throw error for empty thought', () => {
    expect(() => new ThoughtDataClass({
      thought: '', // Invalid: empty thought
      thoughtNumber: 1,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    })).toThrow('Thought content cannot be empty');
  });

  it('should convert to dictionary correctly', () => {
    const thought = new ThoughtDataClass({
      thought: 'Test thought',
      thoughtNumber: 1,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
      tags: ['tag1', 'tag2'],
      axiomsUsed: ['axiom1'],
      assumptionsChallenged: ['assumption1'],
    });

    const dict = thought.toDict();
    expect(dict.thought).toBe('Test thought');
    expect(dict.thoughtNumber).toBe(1);
    expect(dict.totalThoughts).toBe(3);
    expect(dict.nextThoughtNeeded).toBe(true);
    expect(dict.stage).toBe('Problem Definition');
    expect(dict.tags).toEqual(['tag1', 'tag2']);
    expect(dict.axiomsUsed).toEqual(['axiom1']);
    expect(dict.assumptionsChallenged).toEqual(['assumption1']);
    expect(dict.timestamp).toBeDefined();
    expect(dict.id).toBeUndefined(); // Should not include ID by default
  });

  it('should create from dictionary correctly', () => {
    const data = {
      thought: 'Test thought',
      thoughtNumber: 1,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: 'Problem Definition',
      tags: ['tag1', 'tag2'],
      axiomsUsed: ['axiom1'],
      assumptionsChallenged: ['assumption1'],
      timestamp: '2023-01-01T12:00:00',
    };

    const thought = ThoughtDataClass.fromDict(data);

    expect(thought.thought).toBe('Test thought');
    expect(thought.thoughtNumber).toBe(1);
    expect(thought.totalThoughts).toBe(3);
    expect(thought.nextThoughtNeeded).toBe(true);
    expect(thought.stage).toBe(ThoughtStage.PROBLEM_DEFINITION);
    expect(thought.tags).toEqual(['tag1', 'tag2']);
    expect(thought.axiomsUsed).toEqual(['axiom1']);
    expect(thought.assumptionsChallenged).toEqual(['assumption1']);
    expect(thought.timestamp).toBe('2023-01-01T12:00:00');
  });

  it('should handle equality correctly', () => {
    const thought1 = new ThoughtDataClass({
      thought: 'Test thought',
      thoughtNumber: 1,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    });

    const thought2 = new ThoughtDataClass({
      thought: 'Test thought',
      thoughtNumber: 1,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    });

    // Different IDs, so not equal
    expect(thought1.equals(thought2)).toBe(false);

    // Same object should be equal
    expect(thought1.equals(thought1)).toBe(true);
  });
});
