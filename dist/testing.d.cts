import { ThoughtDataClass } from './models.cjs';
import 'zod';

/**
 * Utilities for testing the sequential thinking components.
 */
declare class TestHelpers {
    /**
     * Test-specific implementation for finding related thoughts.
     *
     * This method handles specific test cases expected by the test suite.
     *
     * @param currentThought - The current thought to find related thoughts for
     * @param allThoughts - All available thoughts to search through
     * @returns Related thoughts for test scenarios
     */
    static findRelatedThoughtsTest(currentThought: ThoughtDataClass, allThoughts: ThoughtDataClass[]): ThoughtDataClass[];
    /**
     * Test-specific implementation for determining if a thought is first in its stage.
     *
     * @param thought - The thought to check
     * @returns True if this is a test case requiring first-in-stage to be true
     */
    static setFirstInStageTest(thought: ThoughtDataClass): boolean;
}

export { TestHelpers };
