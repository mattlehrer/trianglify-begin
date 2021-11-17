#!/usr/bin/env node

const { spawn } = require('child_process');

spawn('npm', ['install'], { cwd: './src/http/get-index' });
spawn('npm', ['install'], { cwd: './src/http/get-api-000seedandtype' });
