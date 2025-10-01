"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/models.ts
var models_exports = {};
__export(models_exports, {
  ThoughtDataClass: () => ThoughtDataClass,
  ThoughtDataSchema: () => ThoughtDataSchema,
  ThoughtStage: () => ThoughtStage,
  thoughtStageFromString: () => thoughtStageFromString
});
module.exports = __toCommonJS(models_exports);
var import_zod = require("zod");
var import_uuid = require("uuid");
var ThoughtStage = /* @__PURE__ */ ((ThoughtStage2) => {
  ThoughtStage2["PROBLEM_DEFINITION"] = "Problem Definition";
  ThoughtStage2["RESEARCH"] = "Research";
  ThoughtStage2["ANALYSIS"] = "Analysis";
  ThoughtStage2["SYNTHESIS"] = "Synthesis";
  ThoughtStage2["CONCLUSION"] = "Conclusion";
  return ThoughtStage2;
})(ThoughtStage || {});
function thoughtStageFromString(value) {
  const normalizedValue = value.toLowerCase();
  for (const stage of Object.values(ThoughtStage)) {
    if (stage.toLowerCase() === normalizedValue) {
      return stage;
    }
  }
  const validStages = Object.values(ThoughtStage).join(", ");
  throw new Error(`Invalid thinking stage: '${value}'. Valid stages are: ${validStages}`);
}
var ThoughtDataSchema = import_zod.z.object({
  thought: import_zod.z.string().min(1, "Thought content cannot be empty").trim(),
  thoughtNumber: import_zod.z.number().int().min(1, "Thought number must be positive"),
  totalThoughts: import_zod.z.number().int().min(1, "Total thoughts must be positive"),
  nextThoughtNeeded: import_zod.z.boolean(),
  stage: import_zod.z.nativeEnum(ThoughtStage),
  tags: import_zod.z.array(import_zod.z.string()).default([]),
  axiomsUsed: import_zod.z.array(import_zod.z.string()).default([]),
  assumptionsChallenged: import_zod.z.array(import_zod.z.string()).default([]),
  timestamp: import_zod.z.string().default(() => (/* @__PURE__ */ new Date()).toISOString()),
  id: import_zod.z.string().uuid().default(() => (0, import_uuid.v4)())
}).refine(
  (data) => data.totalThoughts >= data.thoughtNumber,
  {
    message: "Total thoughts must be greater or equal to current thought number",
    path: ["totalThoughts"]
  }
);
var ThoughtDataClass = class _ThoughtDataClass {
  thought;
  thoughtNumber;
  totalThoughts;
  nextThoughtNeeded;
  stage;
  tags;
  axiomsUsed;
  assumptionsChallenged;
  timestamp;
  id;
  constructor(data) {
    const validated = ThoughtDataSchema.parse({
      thought: data.thought,
      thoughtNumber: data.thoughtNumber,
      totalThoughts: data.totalThoughts,
      nextThoughtNeeded: data.nextThoughtNeeded,
      stage: data.stage,
      tags: data.tags ?? [],
      axiomsUsed: data.axiomsUsed ?? [],
      assumptionsChallenged: data.assumptionsChallenged ?? [],
      timestamp: data.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      id: data.id ?? (0, import_uuid.v4)()
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
  validate() {
    return true;
  }
  /**
   * Convert the thought data to a dictionary representation.
   * 
   * @param includeId - Whether to include the ID in the dictionary representation.
   *                    Default is false to maintain compatibility with tests.
   * @returns Dictionary representation of the thought data
   */
  toDict(includeId = false) {
    const data = {
      thought: this.thought,
      thoughtNumber: this.thoughtNumber,
      totalThoughts: this.totalThoughts,
      nextThoughtNeeded: this.nextThoughtNeeded,
      stage: this.stage,
      tags: this.tags,
      axiomsUsed: this.axiomsUsed,
      assumptionsChallenged: this.assumptionsChallenged,
      timestamp: this.timestamp
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
  static fromDict(data) {
    const normalizedData = {
      thought: data.thought,
      thoughtNumber: data.thoughtNumber ?? data.thought_number,
      totalThoughts: data.totalThoughts ?? data.total_thoughts,
      nextThoughtNeeded: data.nextThoughtNeeded ?? data.next_thought_needed,
      stage: typeof data.stage === "string" ? thoughtStageFromString(data.stage) : data.stage,
      tags: data.tags ?? [],
      axiomsUsed: data.axiomsUsed ?? data.axioms_used ?? [],
      assumptionsChallenged: data.assumptionsChallenged ?? data.assumptions_challenged ?? [],
      timestamp: data.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      id: data.id ?? (0, import_uuid.v4)()
    };
    return new _ThoughtDataClass(normalizedData);
  }
  /**
   * Check equality with another ThoughtDataClass based on ID
   */
  equals(other) {
    return this.id === other.id;
  }
  /**
   * Get hash code for the thought data based on ID
   */
  hashCode() {
    return this.id.split("").reduce((hash, char) => {
      return (hash << 5) - hash + char.charCodeAt(0) & 4294967295;
    }, 0);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ThoughtDataClass,
  ThoughtDataSchema,
  ThoughtStage,
  thoughtStageFromString
});
