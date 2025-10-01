# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2024-01-XX

### Added
- Complete conversion from Python to TypeScript
- Complete feature parity with Python implementation
- TypeScript with strict type checking and Zod validation
- Vitest test suite with 100% behavioral parity
- Modern Node.js tooling with pnpm, ESLint, and Prettier
- File locking with proper-lockfile for thread-safe operations
- Structured logging with pino
- MCP server implementation using @modelcontextprotocol/sdk
- All five MCP tools: process_thought, generate_summary, clear_history, export_session, import_session
- Comprehensive error handling and validation
- CLI entry points for development and production
- Debug utilities for MCP connection testing

### Technical Details
- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.3+
- **Validation**: Zod schemas with inferred types
- **File Locking**: proper-lockfile for cross-process safety
- **Logging**: pino with pretty transport in development
- **Testing**: Vitest with comprehensive test coverage
- **Build**: tsup for ESM/CJS dual output
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with consistent style

### Migration Notes
- Maintains full API compatibility with Python version
- All MCP tool signatures remain identical
- Storage format is compatible for import/export
- Enhanced type safety with compile-time and runtime validation
- Improved error handling and logging
- Better development experience with hot reload and watch mode