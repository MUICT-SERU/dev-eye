#! /usr/bin/env node

import { mainFunction } from './cli/lib/index.js';

import http from 'http';
import next from 'next';
import open from 'open';
import path from 'path';

import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
dotenv.config();


const clientDir = path.join(dirname(fileURLToPath(import.meta.url)), '../');
console.log('process.argv:', clientDir)
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
  "_comment2": "a threshold for file ownership percentage, determining when a developer is considered a bus factor ",
  "ownershipPercentage_future_bf": 0.2,
  "_comment3": "a threshold for file ownership percentage, determining when a developer is considered a future bus factor "
};



async function startServer() {
  try {
    // Wait for mainFunction to complete
    // await kill(port);

    console.log(chalk.blue.bold('\nDev-Eye v0.0.1 - CLI'));

    
    // Check if the file exists
    if (!fs.existsSync('dev-eye.json')) {
      // If the file does not exist, write the default configuration to the file
      fs.writeFileSync('dev-eye.json', JSON.stringify(defaultConfig, null, 2), 'utf-8');
      console.log(chalk.green('- Configuration file created successfully with default values (dev-eye.json)'));
    }


    const config = JSON.parse(fs.readFileSync('dev-eye.json', 'utf-8'));
    console.log(chalk.green('1. Configuration options loaded successfully from dev-eye.json'));
    console.log(chalk.green(`   - Time Range for analysis: ${config.timeRange} years`));
    console.log(chalk.green(`   - Ownership Percentage for Bus Factors: ${config.ownershipPercentage} \n`));
    console.log(chalk.green(`   - Ownership Percentage for Future Bus Factors: ${config.ownershipPercentage_future_bf} \n`));


    const { log_file, tf_file, nor_Authors_file, topAuthors_file, meta_data_file } = await mainFunction(config);
    console.log(chalk.blue('7. Generating Dev-Eye Report...'));

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