#! /usr/bin/env node

import { mainFn } from './utils.js';
import { mainFunction } from './lib/index.js';

import next from 'next';
import http from 'http';
import open from 'open';
import path from 'path';
import kill from 'kill-port';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import WebSocket, { WebSocketServer } from 'ws';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import readline from 'readline';
import chalk from 'chalk';
import fs from 'fs';
dotenv.config();



const clientDir = path.join(dirname(fileURLToPath(import.meta.url)), '../client');
// const app = next({ dev: false, dir: clientDir });
// const handle = app.getRequestHandler();
const DEFAULT_TIME_RANGE_YEARS = 10;

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000


const defaultConfig = {
  "timeRange": 4,
  "_comment1": "Time Range is the time period for analysis. e.g the default is 4 which means the analysis is for the last 4 years",
  
  "ownershipPercentage": 0.5,
  "_comment2": "a threshold for file ownership percentage, determining when a developer is considered a bus factor "
};



async function startServer() {
  try {
    // Wait for mainFunction to complete
    // await kill(port);

    console.log(chalk.blue.bold('\nTF 1.0 - CLI'));

    
    
    // Check if the file exists
    if (!fs.existsSync('dev-eye.json')) {
      // If the file does not exist, write the default configuration to the file
      fs.writeFileSync('dev-eye.json', JSON.stringify(defaultConfig, null, 2), 'utf-8');
      console.log(chalk.green('- Configuration file created successfully with default values (dev-eye.json)'));
    }


    const config = JSON.parse(fs.readFileSync('dev-eye.json', 'utf-8'));
    console.log(chalk.green('1. Configuration options loaded successfully from dev-eye.json'));
    console.log(chalk.green(`   - Time Range for analysis: ${config.timeRange} years`));
    console.log(chalk.green(`   - Ownership Percentage: ${config.ownershipPercentage} \n`));

    // console.log('config:',config)

    // const start = process.hrtime();

    const { log_file, tf_file, nor_Authors_file, topAuthors_file, meta_data_file } = await mainFunction(config);
    console.log(chalk.blue('7. Generating Dev-Eye Report...'));



    // const diff = process.hrtime(start);
    // const NS_PER_SEC = 1e9;
    // const timeInSeconds = (diff[0] * NS_PER_SEC + diff[1]) / NS_PER_SEC;
    // const timeInMinutes = timeInSeconds / 60;

    // console.log(`---> ${timeInSeconds} seconds and ${timeInMinutes} min`);

    const app = next({ dev: false, hostname, port, dir: clientDir })
    const handle = app.getRequestHandler()

    app.prepare().then(() => {
      http.createServer(async (req, res) => {
        try {
          res.setHeader('Set-Cookie', [
            `tf_file=${tf_file}; Path=/`,
            `nor_Authors_file=${nor_Authors_file}; Path=/`,
            `topAuthors_file=${topAuthors_file}; Path=/`,
            `meta_data_file=${meta_data_file}; Path=/`,
          ]);

          await handle(req, res)

        } catch (err) {
          console.error('Error occurred handling', req.url, err)
          res.statusCode = 500
          res.end('internal server error')
        }
      })
        .once('error', (err) => {
          console.error(err)
          process.exit(1)
        })
        .listen(port, () => {
          console.log(chalk.yellow(`8. Visualization Ready on http://${hostname}:${port}`));
          open(`http://localhost:${port}`);
        })
    })

  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

// Call startServer to start the server
startServer()



/*
--- years to look back:
--- grouping criteria: (default - 6 months)
--- OWNERSHIP_THRESHOLD = 0.5;
--- FUTURE_OWNERSHIP_THRESHOLD = 0.2
--- FILES_TO_IGNORE

----------
compare various repos of various types (ML..., ETC)
*/
// timeline
// files 
// configuration