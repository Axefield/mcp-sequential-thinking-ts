import {
  ThoughtAnalyzer
} from "./chunk-OHMNCUQM.js";
import {
  ThoughtStorage
} from "./chunk-RK6SUCMM.js";
import "./chunk-AXOTTHYV.js";
import {
  logger
} from "./chunk-USV7ZG3U.js";
import {
  ThoughtDataClass,
  ThoughtStage,
  thoughtStageFromString
} from "./chunk-J6X4GE65.js";

// src/server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
var SequentialThinkingServer = class {
  server;
  storage;
  constructor(storageDir) {
    this.server = new Server(
      {
        name: "sequential-thinking-ts-mcp",
        version: "0.3.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );
    this.storage = new ThoughtStorage(storageDir);
    this.setupToolHandlers();
  }
  /**
   * Initialize the server by setting up storage.
   */
  async initialize() {
    await this.storage.initialize();
  }
  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "process_thought",
            description: "Add a sequential thought with its metadata.",
            inputSchema: {
              type: "object",
              properties: {
                thought: {
                  type: "string",
                  description: "The content of the thought"
                },
                thoughtNumber: {
                  type: "number",
                  description: "The sequence number of this thought"
                },
                totalThoughts: {
                  type: "number",
                  description: "The total expected thoughts in the sequence"
                },
                nextThoughtNeeded: {
                  type: "boolean",
                  description: "Whether more thoughts are needed after this one"
                },
                stage: {
                  type: "string",
                  enum: Object.values(ThoughtStage),
                  description: "The thinking stage"
                },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Optional keywords or categories for the thought"
                },
                axiomsUsed: {
                  type: "array",
                  items: { type: "string" },
                  description: "Optional list of principles or axioms used in this thought"
                },
                assumptionsChallenged: {
                  type: "array",
                  items: { type: "string" },
                  description: "Optional list of assumptions challenged by this thought"
                }
              },
              required: ["thought", "thoughtNumber", "totalThoughts", "nextThoughtNeeded", "stage"]
            }
          },
          {
            name: "generate_summary",
            description: "Generate a summary of the entire thinking process.",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "clear_history",
            description: "Clear the thought history.",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "export_session",
            description: "Export the current thinking session to a file.",
            inputSchema: {
              type: "object",
              properties: {
                filePath: {
                  type: "string",
                  description: "Path to save the exported session"
                }
              },
              required: ["filePath"]
            }
          },
          {
            name: "import_session",
            description: "Import a thinking session from a file.",
            inputSchema: {
              type: "object",
              properties: {
                filePath: {
                  type: "string",
                  description: "Path to the file to import"
                }
              },
              required: ["filePath"]
            }
          }
        ]
      };
    });
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      try {
        switch (name) {
          case "process_thought":
            return await this.processThought(args);
          case "generate_summary":
            return await this.generateSummary();
          case "clear_history":
            return await this.clearHistory();
          case "export_session":
            return await this.exportSession(args);
          case "import_session":
            return await this.importSession(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, `Error in tool ${name}:`);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });
  }
  async processThought(args) {
    try {
      logger.info(`Processing thought #${args.thoughtNumber}/${args.totalThoughts} in stage '${args.stage}'`);
      const thoughtStage = thoughtStageFromString(args.stage);
      const thoughtData = new ThoughtDataClass({
        thought: args.thought,
        thoughtNumber: args.thoughtNumber,
        totalThoughts: args.totalThoughts,
        nextThoughtNeeded: args.nextThoughtNeeded,
        stage: thoughtStage,
        tags: args.tags || [],
        axiomsUsed: args.axiomsUsed || [],
        assumptionsChallenged: args.assumptionsChallenged || []
      });
      thoughtData.validate();
      await this.storage.addThought(thoughtData);
      const allThoughts = this.storage.getAllThoughts();
      const analysis = await ThoughtAnalyzer.analyzeThought(thoughtData, allThoughts);
      logger.info(`Successfully processed thought #${args.thoughtNumber}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(analysis, null, 2)
          }
        ]
      };
    } catch (error) {
      logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, "Error processing thought:");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
              status: "failed"
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }
  async generateSummary() {
    try {
      logger.info("Generating thinking process summary");
      const allThoughts = this.storage.getAllThoughts();
      const summary = ThoughtAnalyzer.generateSummary(allThoughts);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(summary, null, 2)
          }
        ]
      };
    } catch (error) {
      logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, "Error generating summary:");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
              status: "failed"
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }
  async clearHistory() {
    try {
      logger.info("Clearing thought history");
      await this.storage.clearHistory();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ status: "success", message: "Thought history cleared" }, null, 2)
          }
        ]
      };
    } catch (error) {
      logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, "Error clearing history:");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
              status: "failed"
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }
  async exportSession(args) {
    try {
      logger.info(`Exporting session to ${args.filePath}`);
      await this.storage.exportSession(args.filePath);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "success",
              message: `Session exported to ${args.filePath}`
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, "Error exporting session:");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
              status: "failed"
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }
  async importSession(args) {
    try {
      logger.info(`Importing session from ${args.filePath}`);
      await this.storage.importSession(args.filePath);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "success",
              message: `Session imported from ${args.filePath}`
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      logger.error({ error: error instanceof Error ? error : new Error(String(error)) }, "Error importing session:");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
              status: "failed"
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }
  /**
   * Start the MCP server
   */
  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info("Sequential Thinking MCP server started");
  }
  /**
   * Stop the MCP server
   */
  async stop() {
    logger.info("Sequential Thinking MCP server stopped");
  }
};
async function startMcpServer(storageDir) {
  const server = new SequentialThinkingServer(storageDir);
  await server.initialize();
  await server.start();
  return server;
}
export {
  SequentialThinkingServer,
  startMcpServer
};
