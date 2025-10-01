#!/usr/bin/env tsx
/**
 * Debug utility for testing MCP server connections.
 */
import { spawn } from 'child_process';
import { logger } from '../src/logging.js';

async function testServer(serverPath: string): Promise<void> {
  console.log(`Testing MCP server at: ${serverPath}`);
  
  // Start the server process
  const process = spawn('tsx', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      NODE_ENV: 'development',
    },
  });
  
  // Send an initialize message
  const initMessage = {
    jsonrpc: '2.0',
    id: 0,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0',
      },
    },
  };
  
  // Send the message to the server
  const initJson = JSON.stringify(initMessage) + '\n';
  console.log(`Sending: ${initJson.trim()}`);
  process.stdin?.write(initJson);
  process.stdin?.end();
  
  // Read the response
  let responseData = '';
  process.stdout?.on('data', (data) => {
    responseData += data.toString();
  });
  
  process.stderr?.on('data', (data) => {
    console.log('Server stderr output:');
    console.log(data.toString());
  });
  
  // Wait for response or timeout
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      process.kill();
      resolve();
    }, 5000);
    
    process.on('close', () => {
      clearTimeout(timeout);
      resolve();
    });
  });
  
  console.log(`Raw response: ${JSON.stringify(responseData)}`);
  
  // Check for invalid characters
  if (responseData.trim()) {
    try {
      const lines = responseData.trim().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          const parsed = JSON.parse(line);
          console.log('Successfully parsed JSON response:');
          console.log(JSON.stringify(parsed, null, 2));
        }
      }
    } catch (error) {
      console.log(`JSON parse error: ${error}`);
      console.log('First 10 characters:', JSON.stringify(responseData.substring(0, 10)));
      
      // Examine the response in more detail
      for (let i = 0; i < Math.min(20, responseData.length); i++) {
        const char = responseData[i];
        console.log(`Character ${i}: ${JSON.stringify(char)} (ASCII: ${char.charCodeAt(0)})`);
      }
    }
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length !== 1) {
    console.log('Usage: tsx bin/debug-mcp.ts path/to/server.ts');
    process.exit(1);
  }
  
  await testServer(args[0]);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
