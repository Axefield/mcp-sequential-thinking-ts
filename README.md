[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/arben-adm-mcp-sequential-thinking-badge.png)](https://mseep.ai/app/arben-adm-mcp-sequential-thinking)

# Sequential Thinking MCP Server

A Model Context Protocol (MCP) server that facilitates structured, progressive thinking through defined stages. This tool helps break down complex problems into sequential thoughts, track the progression of your thinking process, and generate summaries.

[![Node Version](https://img.shields.io/badge/node-20%2B-green)](https://nodejs.org/downloads/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3%2B-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<a href="https://glama.ai/mcp/servers/m83dfy8feg"><img width="380" height="200" src="https://glama.ai/mcp/servers/m83dfy8feg/badge" alt="Sequential Thinking Server MCP server" /></a>

## Features

- **Structured Thinking Framework**: Organizes thoughts through standard cognitive stages (Problem Definition, Research, Analysis, Synthesis, Conclusion)
- **Thought Tracking**: Records and manages sequential thoughts with metadata
- **Related Thought Analysis**: Identifies connections between similar thoughts
- **Progress Monitoring**: Tracks your position in the overall thinking sequence
- **Summary Generation**: Creates concise overviews of the entire thought process
- **Persistent Storage**: Automatically saves your thinking sessions with thread-safety
- **Data Import/Export**: Share and reuse thinking sessions
- **Extensible Architecture**: Easily customize and extend functionality
- **Robust Error Handling**: Graceful handling of edge cases and corrupted data
- **Type Safety**: Comprehensive type annotations and validation with Zod

## Prerequisites

- Node.js 20 or higher
- pnpm package manager ([Install Guide](https://pnpm.io/installation))

## Key Technologies

- **Zod**: For data validation and serialization
- **proper-lockfile**: For thread-safe file access
- **@modelcontextprotocol/sdk**: For Model Context Protocol integration
- **pino**: For structured logging
- **yaml**: For configuration management

## Project Structure

```
mcp-sequential-thinking/
├── src/
│   ├── server.ts            # Main server implementation and MCP tools
│   ├── models.ts            # Data models with Zod validation
│   ├── storage/
│   │   ├── index.ts         # High-level storage API
│   │   └── utils.ts         # Shared utilities for storage operations
│   ├── analysis.ts          # Thought analysis and pattern detection
│   ├── testing.ts           # Test utilities and helper functions
│   ├── utils.ts             # Common utilities and helper functions
│   └── logging.ts           # Centralized logging configuration
├── bin/
│   ├── run-server.ts        # CLI entry point
│   └── debug-mcp.ts         # Debug tool for MCP connections
├── tests/
│   ├── analysis.spec.ts     # Tests for analysis functionality
│   ├── models.spec.ts       # Tests for data models
│   └── storage.spec.ts      # Tests for persistence layer
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── .eslintrc.cjs
├── .prettierrc
├── vitest.config.ts
├── README.md
├── CHANGELOG.md
├── example.md
└── LICENSE
```

## Quick Start

1. **Set Up Project**
   ```bash
   # Install dependencies
   pnpm install

   # For development with testing tools
   pnpm install
   ```

2. **Run the Server**
   ```bash
   # Run in development mode
   pnpm dev

   # Or build and run
   pnpm build
   node dist/bin/run-server.js
   ```

3. **Run Tests**
   ```bash
   # Run all tests
   pnpm test

   # Run tests in watch mode
   pnpm test:watch
   ```

## Claude Desktop Integration

Add to your Claude Desktop configuration (`%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "tsx",
      "args": [
        "bin/run-server.ts"
      ]
    }
  }
}
```

Alternatively, if you've built the project, you can use:

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "node",
      "args": [
        "dist/bin/run-server.js"
      ]
    }
  }
}
```

## How It Works

The server maintains a history of thoughts and processes them through a structured workflow. Each thought is validated using Zod schemas, categorized into thinking stages, and stored with relevant metadata in a thread-safe storage system. The server automatically handles data persistence, backup creation, and provides tools for analyzing relationships between thoughts.

## Usage Guide

The Sequential Thinking server exposes five main tools:

### 1. `process_thought`

Records and analyzes a new thought in your sequential thinking process.

**Parameters:**

- `thought` (string): The content of your thought
- `thoughtNumber` (number): Position in your sequence (e.g., 1 for first thought)
- `totalThoughts` (number): Expected total thoughts in the sequence
- `nextThoughtNeeded` (boolean): Whether more thoughts are needed after this one
- `stage` (string): The thinking stage - must be one of:
  - "Problem Definition"
  - "Research"
  - "Analysis"
  - "Synthesis"
  - "Conclusion"
- `tags` (array of strings, optional): Keywords or categories for your thought
- `axiomsUsed` (array of strings, optional): Principles or axioms applied in your thought
- `assumptionsChallenged` (array of strings, optional): Assumptions your thought questions or challenges

**Example:**

```typescript
// First thought in a 5-thought sequence
process_thought({
  thought: "The problem of climate change requires analysis of multiple factors including emissions, policy, and technology adoption.",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true,
  stage: "Problem Definition",
  tags: ["climate", "global policy", "systems thinking"],
  axiomsUsed: ["Complex problems require multifaceted solutions"],
  assumptionsChallenged: ["Technology alone can solve climate change"]
})
```

### 2. `generate_summary`

Generates a summary of your entire thinking process.

**Example output:**

```json
{
  "summary": {
    "totalThoughts": 5,
    "stages": {
      "Problem Definition": 1,
      "Research": 1,
      "Analysis": 1,
      "Synthesis": 1,
      "Conclusion": 1
    },
    "timeline": [
      {"number": 1, "stage": "Problem Definition"},
      {"number": 2, "stage": "Research"},
      {"number": 3, "stage": "Analysis"},
      {"number": 4, "stage": "Synthesis"},
      {"number": 5, "stage": "Conclusion"}
    ]
  }
}
```

### 3. `clear_history`

Resets the thinking process by clearing all recorded thoughts.

### 4. `export_session`

Exports the current thinking session to a file.

**Parameters:**
- `filePath` (string): Path to save the exported session

### 5. `import_session`

Imports a thinking session from a file.

**Parameters:**
- `filePath` (string): Path to the file to import

## Practical Applications

- **Decision Making**: Work through important decisions methodically
- **Problem Solving**: Break complex problems into manageable components
- **Research Planning**: Structure your research approach with clear stages
- **Writing Organization**: Develop ideas progressively before writing
- **Project Analysis**: Evaluate projects through defined analytical stages

## Development

### Scripts

- `pnpm dev` - Run the server in development mode with hot reload
- `pnpm build` - Build the project for production
- `pnpm test` - Run the test suite
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier

### Type Safety

This project uses TypeScript with strict type checking and Zod for runtime validation. All external inputs are validated at runtime, and types are inferred from Zod schemas for compile-time safety.

### Testing

Tests are written using Vitest and maintain 100% behavioral parity with the original Python implementation. The test suite covers:

- Model validation and serialization
- Storage operations with file locking
- Analysis algorithms and pattern detection
- MCP server tool implementations

## Migration from Python

This TypeScript port maintains full API compatibility with the original Python implementation. Key differences:

- **Type Safety**: Uses TypeScript and Zod instead of Pydantic
- **File Locking**: Uses `proper-lockfile` instead of `portalocker`
- **Logging**: Uses `pino` instead of Python's `logging` module
- **Async/Await**: All I/O operations are asynchronous
- **Package Management**: Uses `pnpm` instead of `uv`

## License

MIT License