#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

// Ensure event loop remains active in all shell environments
const keepAliveTimer = setInterval(() => {}, 1000 * 60 * 60);

if (process.stdin.isTTY) {
  process.stdin.resume();
}

const args = process.argv.slice(2);
const hasHost = args.includes('-H') || args.includes('--hostname');
const hasPort = args.includes('-p') || args.includes('--port');

const devArgs = ['dev'];
if (!hasHost) {
  devArgs.push('-H', '127.0.0.1');
}
if (!hasPort) {
  devArgs.push('-p', '3000');
}
devArgs.push(...args);

const nextBinPath = path.resolve(process.cwd(), 'node_modules/next/dist/bin/next');

let child = null;
let isShuttingDown = false;
let restartCount = 0;
const MAX_RESTARTS = 10;
const RESTART_WINDOW_MS = 30000;
let lastRestartTime = Date.now();

function startDevServer() {
  if (isShuttingDown) return;

  const now = Date.now();
  if (now - lastRestartTime > RESTART_WINDOW_MS) {
    restartCount = 0;
  }
  lastRestartTime = now;
  restartCount++;

  if (restartCount > MAX_RESTARTS) {
    console.error(`[dev-runner] Exceeded maximum restarts (${MAX_RESTARTS}) in 30s. Exiting.`);
    clearInterval(keepAliveTimer);
    process.exit(1);
  }

  console.log(`[dev-runner] Starting Next.js: next ${devArgs.join(' ')}`);

  child = spawn(process.execPath, [nextBinPath, ...devArgs], {
    stdio: 'inherit',
    env: { ...process.env },
  });

  child.on('exit', (code, signal) => {
    if (isShuttingDown) {
      clearInterval(keepAliveTimer);
      process.exit(code ?? 0);
    }

    // In Next.js dev mode, the server runs indefinitely until SIGINT/SIGTERM.
    // If Next.js CLI exits without user shutdown (even with code 0, which Next.js
    // emits when its child worker is killed or event loop drains), it is a silent crash.
    console.warn(`[dev-runner] Dev server stopped unexpectedly (code: ${code}, signal: ${signal}).`);
    console.log(`[dev-runner] Auto-recovering dev server in 1000ms...`);
    setTimeout(startDevServer, 1000);
  });

  child.on('error', (err) => {
    console.error('[dev-runner] Child process error:', err);
  });
}

function handleShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\n[dev-runner] Received ${signal}. Shutting down dev server cleanly...`);

  if (child) {
    child.kill(signal);
  }
  clearInterval(keepAliveTimer);
  setTimeout(() => process.exit(0), 1000);
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGHUP', () => handleShutdown('SIGHUP'));

startDevServer();
