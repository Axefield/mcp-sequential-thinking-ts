[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/arben-adm-mcp-sequential-thinking-badge.png)](https://mseep.ai/app/arben-adm-mcp-sequential-thinking)

# Sequential Thinking MCP Server

A Model Context Protocol (MCP) server that facilitates structured, progressive thinking through defined stages. This tool helps break down complex problems into sequential thoughts, track the progression of your thinking process, and generate summaries.

> **Version 0.3.0** - Complete TypeScript port with enhanced features, improved CLI, and comprehensive testing.

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
- **pino**: For structured logging with pretty formatting
- **yaml**: For configuration management
- **uuid**: For unique identifier generation
- **chalk**: For terminal styling and colors
- **boxen**: For creating terminal boxes and borders
- **ora**: For elegant terminal spinners

## Project Structure

```
mcp-sequential-thinking-ts/
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
├── package-lock.json
├── tsconfig.json
├── tsconfig.build.json
├── vitest.config.ts
├── .gitignore
├── README.md
├── CHANGELOG.md
├── example.md
└── LICENSE
```

## Quick Start

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/mcp-sequential-thinking-ts.git
   cd mcp-sequential-thinking-ts
   ```

2. **Install Dependencies**
   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Or using npm
   npm install

   # Or using yarn
   yarn install
   ```

3. **Build the Project**
   ```bash
   pnpm build
   ```

### Running the Server

1. **Development Mode**
   ```bash
   # Run with hot reload
   pnpm dev
   ```

2. **Production Mode**
   ```bash
   # Build first
   pnpm build
   
   # Then run
   node dist/bin/run-server.js
   ```

3. **Global Installation (Optional)**
   ```bash
   # Install globally for CLI access
   npm install -g .
   
   # Then run from anywhere
   mcp-sequential-thinking
   ```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test --coverage
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

**Examples:**

```typescript
// Example 1: First thought in a 5-thought sequence
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

// Example 2: Research stage thought
process_thought({
  thought: "Recent studies show that renewable energy costs have dropped 85% in the last decade, making them competitive with fossil fuels.",
  thoughtNumber: 2,
  totalThoughts: 5,
  nextThoughtNeeded: true,
  stage: "Research",
  tags: ["renewable energy", "cost analysis", "market trends"],
  axiomsUsed: ["Economic viability drives adoption"],
  assumptionsChallenged: ["Renewable energy is too expensive"]
})

// Example 3: Analysis stage thought
process_thought({
  thought: "The data suggests that policy intervention is necessary to accelerate the transition, as market forces alone are insufficient.",
  thoughtNumber: 3,
  totalThoughts: 5,
  nextThoughtNeeded: true,
  stage: "Analysis",
  tags: ["policy analysis", "market failure", "intervention"],
  axiomsUsed: ["Market failures require policy intervention"],
  assumptionsChallenged: ["Free markets will solve environmental problems"]
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

## CLI Usage

The server can also be used as a standalone CLI tool:

```bash
# Run the server directly
npx tsx bin/run-server.ts

# Or if installed globally
mcp-sequential-thinking

# Debug MCP connections
npx tsx bin/debug-mcp.ts
```

## Practical Applications

- **Decision Making**: Work through important decisions methodically
- **Problem Solving**: Break complex problems into manageable components
- **Research Planning**: Structure your research approach with clear stages
- **Writing Organization**: Develop ideas progressively before writing
- **Project Analysis**: Evaluate projects through defined analytical stages
- **Strategic Planning**: Organize business strategies through structured thinking
- **Academic Research**: Structure research methodology and analysis
- **Creative Problem Solving**: Apply systematic thinking to creative challenges

## Development

### Scripts

- `pnpm dev` - Run the server in development mode with hot reload
- `pnpm build` - Build the project for production (ESM/CJS dual output)
- `pnpm test` - Run the test suite
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm prepare` - Install Husky git hooks

### Type Safety

This project uses TypeScript with strict type checking and Zod for runtime validation. All external inputs are validated at runtime, and types are inferred from Zod schemas for compile-time safety.

### Testing

Tests are written using Vitest and maintain 100% behavioral parity with the original Python implementation. The test suite covers:

- Model validation and serialization
- Storage operations with file locking
- Analysis algorithms and pattern detection
- MCP server tool implementations

## Troubleshooting

### Common Issues

1. **MCP Connection Issues**
   ```bash
   # Use the debug tool to test connections
   npx tsx bin/debug-mcp.ts
   ```

2. **Storage Permission Errors**
   - Ensure the storage directory is writable
   - Check file permissions on the data directory

3. **TypeScript Build Errors**
   ```bash
   # Clean and rebuild
   rm -rf dist node_modules
   pnpm install
   pnpm build
   ```

4. **Test Failures**
   ```bash
   # Run tests with verbose output
   pnpm test --reporter=verbose
   ```

## Migration from Python

This TypeScript port maintains full API compatibility with the original Python implementation. Key differences:

- **Type Safety**: Uses TypeScript and Zod instead of Pydantic
- **File Locking**: Uses `proper-lockfile` instead of `portalocker`
- **Logging**: Uses `pino` instead of Python's `logging` module
- **Async/Await**: All I/O operations are asynchronous
- **Package Management**: Uses `pnpm` instead of `uv`
- **Enhanced CLI**: Better terminal experience with colors and progress indicators
- **Improved Error Handling**: More descriptive error messages and recovery

## License

MIT License