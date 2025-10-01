#!/usr/bin/env tsx
/**
 * Run script for the Sequential Thinking MCP server.
 * This script makes it easy to run the server directly from the root directory.
 */
import { logger } from '../src/logging.js';
import { startMcpServer } from '../src/server.js';

async function main(): Promise<void> {
  try {
    logger.info('Starting Sequential Thinking MCP server from runner script');
    
    const storageDir = process.env.MCP_STORAGE_DIR;
    const server = await startMcpServer(storageDir);
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });

    // Keep the process alive
    await new Promise(() => {});
  } catch (error) {
    logger.error('Fatal error in MCP server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
