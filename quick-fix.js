// Quick fix script to get the app running
import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔧 Starting quick fix...');

try {
  // 1. Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing core dependencies...');
    
    // Install only essential packages to get the app running
    const essentialPackages = [
      'express',
      'cors', 
      'helmet',
      'compression',
      'express-rate-limit',
      'tsx',
      'typescript',
      '@types/node',
      '@types/express',
      'zod'
    ];
    
    execSync('npm init -y', { stdio: 'inherit' });
    execSync(`npm install ${essentialPackages.join(' ')}`, { stdio: 'inherit' });
  }

  // 2. Create a minimal server file if needed
  if (!fs.existsSync('server/minimal-server.js')) {
    const minimalServer = `
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Talez Pet Training Platform is running'
  });
});

// Basic home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Talez Pet Training Platform',
    version: '1.0.0',
    status: 'running'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    server: 'running',
    timestamp: new Date().toISOString(),
    platform: 'Talez Pet Training'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📍 Health: http://localhost:\${PORT}/health\`);
  console.log(\`🌐 Home: http://localhost:\${PORT}\`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
`;

    fs.writeFileSync('server/minimal-server.js', minimalServer);
    console.log('✅ Created minimal server');
  }

  console.log('🎉 Quick fix completed! You can now run:');
  console.log('   node server/minimal-server.js');
  
} catch (error) {
  console.error('❌ Error during quick fix:', error.message);
  console.log('💡 Manual steps:');
  console.log('   1. Run: npm install express cors tsx typescript');
  console.log('   2. Run: node server/minimal-server.js');
}