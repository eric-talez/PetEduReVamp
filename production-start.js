#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set production environment
process.env.NODE_ENV = 'production';

console.log('Starting FunnyTalez Backend in Production Mode...');

// Start the server using tsx directly
const serverPath = path.join(__dirname, 'server', 'index.ts');
const tsxPath = path.join(__dirname, 'node_modules', '.bin', 'tsx');

const server = spawn('node', [tsxPath, serverPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});