import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { ThoughtStage, ThoughtDataClass } from '../src/models.js';
import { ThoughtStorage } from '../src/storage/index.js';

describe('ThoughtStorage', () => {
  let tempDir: string;
  let storage: ThoughtStorage;

  beforeEach(async () => {
    // Create a temporary directory for storage tests
    tempDir = await mkdtemp(join(tmpdir(), 'mcp-test-'));
    storage = new ThoughtStorage(tempDir);
    await storage.initialize();
  });

  afterEach(async () => {
    // Clean up temporary directory
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should add a thought to storage', async () => {
    const thought = new ThoughtDataClass({
      thought: 'Test thought',
      thoughtNumber: 1,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    });

    await storage.addThought(thought);

    // Check that the thought was added to memory
    const allThoughts = storage.getAllThoughts();
    expect(allThoughts).toHaveLength(1);
    expect(allThoughts[0].thought).toBe('Test thought');
  });

  it('should get all thoughts from storage', async () => {
    const thought1 = new ThoughtDataClass({
      thought: 'Test thought 1',
      thoughtNumber: 1,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    });

    const thought2 = new ThoughtDataClass({
      thought: 'Test thought 2',
      thoughtNumber: 2,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.RESEARCH,
    });

    await storage.addThought(thought1);
    await storage.addThought(thought2);

    const thoughts = storage.getAllThoughts();
    expect(thoughts).toHaveLength(2);
    expect(thoughts[0].thought).toBe('Test thought 1');
    expect(thoughts[1].thought).toBe('Test thought 2');
  });

  it('should get thoughts by stage', async () => {
    const thought1 = new ThoughtDataClass({
      thought: 'Test thought 1',
      thoughtNumber: 1,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    });

    const thought2 = new ThoughtDataClass({
      thought: 'Test thought 2',
      thoughtNumber: 2,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.RESEARCH,
    });

    const thought3 = new ThoughtDataClass({
      thought: 'Test thought 3',
      thoughtNumber: 3,
      totalThoughts: 3,
      nextThoughtNeeded: false,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    });

    await storage.addThought(thought1);
    await storage.addThought(thought2);
    await storage.addThought(thought3);

    const problemDefThoughts = storage.getThoughtsByStage(ThoughtStage.PROBLEM_DEFINITION);
    const researchThoughts = storage.getThoughtsByStage(ThoughtStage.RESEARCH);

    expect(problemDefThoughts).toHaveLength(2);
    expect(problemDefThoughts[0].thought).toBe('Test thought 1');
    expect(problemDefThoughts[1].thought).toBe('Test thought 3');

    expect(researchThoughts).toHaveLength(1);
    expect(researchThoughts[0].thought).toBe('Test thought 2');
  });

  it('should clear thought history', async () => {
    const thought = new ThoughtDataClass({
      thought: 'Test thought',
      thoughtNumber: 1,
      totalThoughts: 3,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    });

    await storage.addThought(thought);
    expect(storage.getAllThoughts()).toHaveLength(1);

    await storage.clearHistory();
    expect(storage.getAllThoughts()).toHaveLength(0);
  });

  it('should export and import session', async () => {
    const thought1 = new ThoughtDataClass({
      thought: 'Test thought 1',
      thoughtNumber: 1,
      totalThoughts: 2,
      nextThoughtNeeded: true,
      stage: ThoughtStage.PROBLEM_DEFINITION,
    });

    const thought2 = new ThoughtDataClass({
      thought: 'Test thought 2',
      thoughtNumber: 2,
      totalThoughts: 2,
      nextThoughtNeeded: false,
      stage: ThoughtStage.CONCLUSION,
    });

    await storage.addThought(thought1);
    await storage.addThought(thought2);

    // Export the session
    const exportFile = join(tempDir, 'export.json');
    await storage.exportSession(exportFile);

    // Clear the history
    await storage.clearHistory();
    expect(storage.getAllThoughts()).toHaveLength(0);

    // Import the session
    await storage.importSession(exportFile);

    // Check that the thoughts were imported correctly
    const importedThoughts = storage.getAllThoughts();
    expect(importedThoughts).toHaveLength(2);
    expect(importedThoughts[0].thought).toBe('Test thought 1');
    expect(importedThoughts[1].thought).toBe('Test thought 2');
  });
});
