import git from 'simple-git';
import fs, { write } from 'fs';
import { get } from 'http';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import { group, log } from 'console';
import {parseGitLog, calculateTruckFactorUsingNormalizedDOA, computeDOA, normalizeDOA, getTopAuthors} from './tf_functions.js'
import chalk from 'chalk';

const gitInstance = git(path);
const currentDirectory = process.cwd();


const TIME_RANGE_YEARS = 10;

export const DEFAULT_TIME_RANGE_YEARS = 4; 
const repoPath = process.cwd();
// const repoName = path.basename(repoPath);

const tempDir = os.tmpdir();
const getTemporaryPath = (fileName) => {
    const filePath = path.join(tempDir, fileName);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, ''); // Create the file if it doesn't exist
    }
    return filePath;
}

const isGitRepo = async () => {
    // get current directory
    return new Promise((resolve, reject) => {
        gitInstance.checkIsRepo((err, isValidRepo) => {
            if (err) {
                reject(err);
            } else {
                //also return repo name
                const repoName =  repoPath;
                // console.log(path.basename(repoPath))
                resolve({isValidRepo, repoName:'repoName'});
            }
        });
    });
}

const getGitMeta = (repoPath, type) => {
    const args ={
        created_date: ['log', '--reverse', "--format=%aD", '--date=iso',],
        updated_date: ['log', '-1','--format=%aD'],
        repo_name: ['remote', 'get-url', 'origin']
    }
    return new Promise((resolve, reject) => {
        const child = spawn('git', args[type], { cwd: repoPath });
        let output = '';
        let error = '';

        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.stderr.on('data', (data) => {
            error += data.toString();
        });

        child.on('close', (code) => {
            if (code === 0) {
                if (type === 'created_date') {
                    // Split the output to get the first commit date
                    resolve(output.split('\n')[0]);
                } else if(type === 'repo_name'){
                    const repoUrl = output.trim();
                    const repoName = repoUrl.substring(repoUrl.lastIndexOf('/') + 1, repoUrl.length).replace('.git', '');
                    resolve(repoName);
                }
                else {
                    resolve(output.trim());
                }
            } else {
                reject(new Error(error || `Command failed with exit code ${code}`));
            }
        });
    }
);
}

const get_metadata = async (repoPath,numberOfCommits,startDate) => {
    // const created_data = getGitMeta(repoPath, 'created_date');
    const updated_data = await getGitMeta(repoPath, 'updated_date');
    const repoName = await getGitMeta(repoPath, 'repo_name');
    const res = await Promise.all([updated_data, repoName])

    return {
        created_date: startDate,
        updated_date: res[0],
        repoName: res[1],
        numberOfCommits
    }

}

const get_commits = (repoPath, command, args,repoName='dev-eye') => {
    const log_file = getTemporaryPath(`${repoName}_log.txt`);
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { cwd: repoPath });
        const writeStream = fs.createWriteStream(log_file);

        child.stdout.on('data', (data) => {
            writeStream.write(data);
        });

        child.stdout.on('end', () => {
            writeStream.end();
            resolve(log_file);
        });

        child.stderr.on('data', (data) => {
            reject(data.toString());
        });
        child.on('error', (error) => {
            reject(error);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve(log_file);
            } else {
                reject(`Process exited with code ${code}`);
            }
        });
    });
}

// Calculate the date three years ago using plain JavaScript Date object

const get_args = (years=4) => {
    const today = new Date();
    const yearsAgo = new Date(today.getFullYear() - years, today.getMonth(), today.getDate());
    const formattedDate = yearsAgo.toISOString().split('T')[0];

    const args = [
        "log",
        "--numstat",
        "--all",
        '--pretty=format:%an | %ad | %ae', 
        '--date=format:%Y-%m-%d', 
        `--since="${formattedDate}"`,
        ':(exclude)*.png',
        ':(exclude)*.svg',
        ':(exclude)*.DS_Store',
        ':(exclude)*.jpg',
        ':(exclude)*.jpeg',
        ':(exclude)*.gif',
        ':(exclude)*.pdf',
        ':(exclude)*-lock.json',
        ]

    return {git_log_args:args, startDate: yearsAgo.toUTCString()};
    

}




const mainFunction = async (config) => {
    try {
        console.log(chalk.green('2. Reading commit details from log file'));

        
        
        const {isValidRepo, repoName} = await isGitRepo(repoPath);
       

        if(isValidRepo){
            
            const {git_log_args, startDate} = get_args(config.timeRange);
            console.log(chalk.green(`   - current directory is a valid git repository`));
            const log_file = await get_commits(repoPath, "git", git_log_args,repoName);
            console.log(chalk.green(`   - Retrieved commits from the last ${config.timeRange} years successfully \n`));
            // const result = "/var/folders/37/y13qhc316xjckkx6zqw27rgr0000gn/T/my-git-tool_log.txt"
            
            console.log(chalk.green('3. Parsing commit details from log file'));
            const { authorFileChanges, fileFirstAuthor, numberOfCommits } = parseGitLog(log_file)
            console.log(chalk.green(`   - parsed commit details from log file successfully \n`));
            
            const meta = await get_metadata(repoPath,numberOfCommits, startDate);
            // console.log(meta)

            
            console.log(chalk.green('4. Computing Degree of Authorship (DOA) for each file'));
            const fileDOA = computeDOA(authorFileChanges, fileFirstAuthor);
            console.log(chalk.green(`   - computed DOA for each file successfully \n`));
           

            console.log(chalk.green('5. Normalizing Degree of Authorship (DOA) for each author'));
            const {normalizedAuthors, totalFiles} = normalizeDOA(fileDOA);
            console.log(chalk.green(`   - normalized DOA for each author successfully`));
            const sortedTopAuthors = getTopAuthors(fileDOA);
            console.log(chalk.green(`   - retrieved top authors based on DOA successfully \n`));

             console.log(chalk.green('6. Computing Truck Factor (TF) using normalized DOA'));
            const truckFactor = calculateTruckFactorUsingNormalizedDOA(normalizedAuthors, totalFiles, sortedTopAuthors, config.ownershipPercentage);
            console.log(chalk.green(`   - computed Truck Factor (TF) using normalized DOA successfully \n`));
            
            // console.log(truckFactor)


            const tf_file = getTemporaryPath(`${repoName}_truckFactor.json`);
            const nor_Authors_file = getTemporaryPath(`${repoName}_normalizedAuthors.json`);
            const topAuthors_file = getTemporaryPath(`${repoName}_topAuthors.json`);
            const meta_data_file = getTemporaryPath(`${repoName}_meta.json`);

            fs.writeFileSync(tf_file, JSON.stringify(truckFactor));
            fs.writeFileSync(nor_Authors_file, JSON.stringify(normalizedAuthors));
            fs.writeFileSync(topAuthors_file, JSON.stringify(sortedTopAuthors));
            fs.writeFileSync(meta_data_file, JSON.stringify(meta));



            // console.log("total files:", totalFiles.size)
            // console.log("Top 10 authors", sortedTopAuthors.slice(0,10))
            // console.log('')

            return {log_file, tf_file, nor_Authors_file, topAuthors_file, meta_data_file};
        }
    } catch (error) {
        console.error('Error getting commit details:', error);
    }
}

export { mainFunction };


// TODO:
//  0	0	docs/docs/{10.7-pure-render-mixin.ko-KR.md => 10.8-pure-render-mixin.ko-KR.md}   exclude renames
