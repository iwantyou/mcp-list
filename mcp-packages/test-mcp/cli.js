#!/usr/bin/env node
import { main } from './dist/index.js';

main().catch((error) => {
    console.error('MCP Server Error:', error);
    process.exit(1);
}); 