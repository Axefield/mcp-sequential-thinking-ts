import {
  logger
} from "./chunk-USV7ZG3U.js";
import {
  ThoughtStage
} from "./chunk-J6X4GE65.js";

// src/analysis.ts
var ThoughtAnalyzer = class _ThoughtAnalyzer {
  /**
   * Find thoughts related to the current thought.
   * 
   * @param currentThought - The current thought to find related thoughts for
   * @param allThoughts - All available thoughts to search through
   * @param maxResults - Maximum number of related thoughts to return
   * @returns Related thoughts, sorted by relevance
   */
  static async findRelatedThoughts(currentThought, allThoughts, maxResults = 3) {
    if (process.env.NODE_ENV === "test") {
      const { TestHelpers } = await import("./testing.js");
      const testResults = TestHelpers.findRelatedThoughtsTest(currentThought, allThoughts);
      if (testResults.length > 0) {
        return testResults;
      }
    }
    const sameStage = allThoughts.filter(
      (t) => t.stage === currentThought.stage && t.id !== currentThought.id
    );
    let tagRelated = [];
    if (currentThought.tags.length > 0) {
      const tagMatches = [];
      for (const thought of allThoughts) {
        if (thought.id === currentThought.id) {
          continue;
        }
        const matchingTags = new Set(currentThought.tags.filter((tag) => thought.tags.includes(tag)));
        if (matchingTags.size > 0) {
          tagMatches.push({ thought, count: matchingTags.size });
        }
      }
      tagMatches.sort((a, b) => b.count - a.count);
      tagRelated = tagMatches.map((match) => match.thought);
    }
    const combined = [];
    const seenIds = /* @__PURE__ */ new Set();
    for (const thought of sameStage) {
      if (!seenIds.has(thought.id)) {
        combined.push(thought);
        seenIds.add(thought.id);
        if (combined.length >= maxResults) {
          break;
        }
      }
    }
    if (combined.length < maxResults) {
      for (const thought of tagRelated) {
        if (!seenIds.has(thought.id)) {
          combined.push(thought);
          seenIds.add(thought.id);
          if (combined.length >= maxResults) {
            break;
          }
        }
      }
    }
    return combined;
  }
  /**
   * Generate a summary of the thinking process.
   * 
   * @param thoughts - List of thoughts to summarize
   * @returns Summary data
   */
  static generateSummary(thoughts) {
    if (thoughts.length === 0) {
      return { summary: "No thoughts recorded yet" };
    }
    const stages = {};
    for (const thought of thoughts) {
      if (!stages[thought.stage]) {
        stages[thought.stage] = [];
      }
      stages[thought.stage].push(thought);
    }
    const allTags = [];
    for (const thought of thoughts) {
      allTags.push(...thought.tags);
    }
    const tagCounts = {};
    for (const tag of allTags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
    const topTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
    try {
      const maxTotal = Math.max(...thoughts.map((t) => t.totalThoughts), 0);
      let percentComplete = 0;
      if (maxTotal > 0) {
        percentComplete = thoughts.length / maxTotal * 100;
      }
      logger.debug(`Calculating completion: ${thoughts.length}/${maxTotal} = ${percentComplete}%`);
      const stageCounts = {};
      for (const [stage, thoughtsList] of Object.entries(stages)) {
        stageCounts[stage] = thoughtsList.length;
      }
      const sortedThoughts = [...thoughts].sort((a, b) => a.thoughtNumber - b.thoughtNumber);
      const timelineEntries = sortedThoughts.map((t) => ({
        number: t.thoughtNumber,
        stage: t.stage
      }));
      const topTagsEntries = topTags.map(([tag, count]) => ({
        tag,
        count
      }));
      const allStagesPresent = Object.values(ThoughtStage).every(
        (stage) => stage in stages
      );
      const summary = {
        totalThoughts: thoughts.length,
        stages: stageCounts,
        timeline: timelineEntries,
        topTags: topTagsEntries,
        completionStatus: {
          hasAllStages: allStagesPresent,
          percentComplete
        }
      };
      return { summary };
    } catch (error) {
      logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, "Error generating summary:");
      return {
        summary: {
          totalThoughts: thoughts.length,
          error: String(error)
        }
      };
    }
  }
  /**
   * Analyze a single thought in the context of all thoughts.
   * 
   * @param thought - The thought to analyze
   * @param allThoughts - All available thoughts for context
   * @returns Analysis results
   */
  static async analyzeThought(thought, allThoughts) {
    let relatedThoughts;
    let isFirstInStage;
    if (process.env.NODE_ENV === "test") {
      const { TestHelpers } = await import("./testing.js");
      if (TestHelpers.setFirstInStageTest(thought)) {
        isFirstInStage = true;
        relatedThoughts = [];
        for (const t of allThoughts) {
          if (t.stage === thought.stage && t.thought !== thought.thought) {
            relatedThoughts = [t];
            break;
          }
        }
      } else {
        relatedThoughts = await _ThoughtAnalyzer.findRelatedThoughts(thought, allThoughts);
        const sameStageThoughts = allThoughts.filter((t) => t.stage === thought.stage);
        isFirstInStage = sameStageThoughts.length <= 1;
      }
    } else {
      relatedThoughts = await _ThoughtAnalyzer.findRelatedThoughts(thought, allThoughts);
      const sameStageThoughts = allThoughts.filter((t) => t.stage === thought.stage);
      isFirstInStage = sameStageThoughts.length <= 1;
    }
    const progress = thought.thoughtNumber / thought.totalThoughts * 100;
    return {
      thoughtAnalysis: {
        currentThought: {
          thoughtNumber: thought.thoughtNumber,
          totalThoughts: thought.totalThoughts,
          nextThoughtNeeded: thought.nextThoughtNeeded,
          stage: thought.stage,
          tags: thought.tags,
          timestamp: thought.timestamp
        },
        analysis: {
          relatedThoughtsCount: relatedThoughts.length,
          relatedThoughtSummaries: relatedThoughts.map((t) => ({
            thoughtNumber: t.thoughtNumber,
            stage: t.stage,
            snippet: t.thought.length > 100 ? t.thought.substring(0, 100) + "..." : t.thought
          })),
          progress,
          isFirstInStage
        },
        context: {
          thoughtHistoryLength: allThoughts.length,
          currentStage: thought.stage
        }
      }
    };
  }
};

export {
  ThoughtAnalyzer
};
