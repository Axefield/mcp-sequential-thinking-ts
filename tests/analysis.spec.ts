import { describe, it, expect, beforeEach } from 'vitest';
import { ThoughtStage, ThoughtDataClass } from '../src/models.js';
import { ThoughtAnalyzer } from '../src/analysis.js';

describe('ThoughtAnalyzer', () => {
  let thought1: ThoughtDataClass;
  let thought2: ThoughtDataClass;
  let thought3: ThoughtDataClass;
  let thought4: ThoughtDataClass;
  let allThoughts: ThoughtDataClass[];

  beforeEach(() => {
    thought1 = new ThoughtDataClass({
      thought: 'First thought about climate change',
      thoughtNumber: 1,
      totalThoughts: 5,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
      tags: ['climate', 'global'],
    });

    thought2 = new ThoughtDataClass({
      thought: 'Research on emissions data',
      thoughtNumber: 2,
      totalThoughts: 5,
      nextThoughtNeeded: true,
      stage: ThoughtStage.RESEARCH,
      tags: ['climate', 'data', 'emissions'],
    });

    thought3 = new ThoughtDataClass({
      thought: 'Analysis of policy impacts',
      thoughtNumber: 3,
      totalThoughts: 5,
      nextThoughtNeeded: true,
      stage: ThoughtStage.ANALYSIS,
      tags: ['policy', 'impact'],
    });

    thought4 = new ThoughtDataClass({
      thought: 'Another problem definition thought',
      thoughtNumber: 4,
      totalThoughts: 5,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
      tags: ['problem', 'definition'],
    });

    allThoughts = [thought1, thought2, thought3, thought4];
  });

  it('should find related thoughts by stage', () => {
    const related = ThoughtAnalyzer.findRelatedThoughts(thought1, allThoughts);

    // Should find thought4 which is in the same stage
    expect(related).toHaveLength(1);
    expect(related[0]).toBe(thought4);
  });

  it('should find related thoughts by tags', () => {
    // Create a new thought with tags that match thought1 and thought2
    const newThought = new ThoughtDataClass({
      thought: 'New thought with climate tag',
      thoughtNumber: 5,
      totalThoughts: 5,
      nextThoughtNeeded: false,
      stage: ThoughtStage.SYNTHESIS,
      tags: ['climate', 'synthesis'],
    });

    const allThoughtsWithNew = [...allThoughts, newThought];

    const related = ThoughtAnalyzer.findRelatedThoughts(newThought, allThoughtsWithNew);

    // Should find thought1 and thought2 which have the "climate" tag
    expect(related).toHaveLength(2);
    expect(related).toContain(thought1);
    expect(related).toContain(thought2);
  });

  it('should generate summary with no thoughts', () => {
    const summary = ThoughtAnalyzer.generateSummary([]);

    expect(summary).toEqual({ summary: 'No thoughts recorded yet' });
  });

  it('should generate summary with thoughts', () => {
    const summary = ThoughtAnalyzer.generateSummary(allThoughts);

    expect(summary.summary.totalThoughts).toBe(4);
    expect(summary.summary.stages['Problem Definition']).toBe(2);
    expect(summary.summary.stages['Research']).toBe(1);
    expect(summary.summary.stages['Analysis']).toBe(1);
    expect(summary.summary.timeline).toHaveLength(4);
    expect(summary.summary.topTags).toBeDefined();
    expect(summary.summary.completionStatus).toBeDefined();
  });

  it('should analyze a thought', () => {
    const analysis = ThoughtAnalyzer.analyzeThought(thought1, allThoughts);

    expect(analysis.thoughtAnalysis.currentThought.thoughtNumber).toBe(1);
    expect(analysis.thoughtAnalysis.currentThought.stage).toBe('Problem Definition');
    expect(analysis.thoughtAnalysis.analysis.relatedThoughtsCount).toBe(1);
    expect(analysis.thoughtAnalysis.analysis.progress).toBe(20.0); // 1/5 * 100
    expect(analysis.thoughtAnalysis.analysis.isFirstInStage).toBe(true);
    expect(analysis.thoughtAnalysis.context.thoughtHistoryLength).toBe(4);
  });
});
