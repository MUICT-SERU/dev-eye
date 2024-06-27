import fs, { write } from 'fs';


function processFileNames(file) {
    // Extract the old part and new part using regular expression
    const matches = file.match(/{(.*?) => (.*?)}/);

    if (matches) {
        const oldPart = matches[1].trim();
        const newPart = matches[2].trim();
        
        // Construct the old file name and new file name
        const oldFileName = file.replace(`{${oldPart} => ${newPart}}`, oldPart);
        const newFileName = file.replace(`{${oldPart} => ${newPart}}`, newPart);
        
        // Clean up any occurrences of multiple slashes
        const cleanOldFileName = oldFileName.replace(/\/{2,}/g, '/');

        return {
            oldFileName: cleanOldFileName,
            newFileName: newFileName
        };
    } else {
        // No match found, return the file name as is
        if (file.includes(' => ')) {
            const parts = file.split(' => ');
           
            const oldFileName = parts[0]?.trim();
            const newFileName = parts[1]?.trim();
    
            return {
                oldFileName: oldFileName,
                newFileName: newFileName || oldFileName
            }

        }else{
            return {
                oldFileName: file,
                newFileName: file
            }
        }
     
      

    }
}


export function parseGitLog(log_file) {
    const gitLogData = fs.readFileSync(log_file, 'utf-8');
    const lines = gitLogData.split('\n');
    const authorFileChanges = {};
    const fileFirstAuthor = {};
    const emailToNameMap ={}
    let currentAuthor = null;
    let currentDate = null;
    let fileRenames = {};

    let numberOfCommits =0

    lines.forEach(line => {
        if (line.includes('|')) {
            // New author entry
            const [author, date, email] = line.split('|').map(part => part.trim()?.toLocaleLowerCase());
            
             // If the email is not in the map, add it with the current name
            if (!emailToNameMap[email]) {
                emailToNameMap[email] = author;
            }
            currentAuthor = emailToNameMap[email];
            
            // currentAuthor = author;
            currentDate = new Date(date);
            if (!authorFileChanges[currentAuthor]) {
                authorFileChanges[currentAuthor] = {};
            }
            numberOfCommits +=1
        } else if (currentAuthor) {
            // File entry for the current author
            const [insertions, deletions, ...filePathParts] = line.split(/\s+/);
            const {newFileName, oldFileName} = processFileNames(filePathParts.join(' '));

            
            // Update the mapping for the old file name to the new file name
            if (oldFileName != newFileName) {
                fileRenames[oldFileName] = newFileName;
            }
                
            const filePath = fileRenames[oldFileName] || oldFileName;

            if (!isNaN(parseInt(insertions)) || !isNaN(parseInt(deletions))) {
                if (!authorFileChanges[currentAuthor][filePath]) {
                    authorFileChanges[currentAuthor][filePath] = { insertions: 0, deletions: 0, commits: 0 };
                }
                authorFileChanges[currentAuthor][filePath].insertions += parseInt(insertions) || 0;
                authorFileChanges[currentAuthor][filePath].deletions += parseInt(deletions) || 0;
                authorFileChanges[currentAuthor][filePath].commits += 1;

                // Track the first author of each file with the earliest date
                if (!fileFirstAuthor[filePath] || fileFirstAuthor[filePath].date > currentDate) {
                    fileFirstAuthor[filePath] = { author: currentAuthor, date: currentDate };
                }
            }
        }
    });

    return { authorFileChanges, fileFirstAuthor, numberOfCommits };
}

// Function to compute DOA for each file
export function computeDOA(authorFileChanges, fileFirstAuthor) {
    const fileDOA = {};
    
    // console.log(authorFileChanges)

    //-- DOA
    // first author
    // changes
    // changes by others


    // console.log(authorFileChanges)
    Object.keys(authorFileChanges).forEach(author => {
        Object.keys(authorFileChanges[author]).forEach(file => {
            const { commits } = authorFileChanges[author][file];
            const FA = fileFirstAuthor[file].author === author ? 1 : 0;
            const DL = commits;
            const AC = Object.keys(authorFileChanges).reduce((acc, otherAuthor) => {
                if (otherAuthor !== author && authorFileChanges[otherAuthor][file]) {
                    return acc + authorFileChanges[otherAuthor][file].commits;
                }
                return acc;
            }, 0);

            const DOA = 3.293 + (1.098 * FA) + (0.164 * DL) - (0.321 * Math.log(1 + AC));

            if (!fileDOA[file]) {
                fileDOA[file] = {};
            }

            fileDOA[file][author] = DOA;
        });
    });

    return fileDOA;
}

// Function to normalize DOA values
export function normalizeDOA(fileDOA, k = 0.75, m = 3.293) {
    const normalizedDOA = {};
    const normalizedAuthors = {}
    const totalFiles =new Set()

    Object.keys(fileDOA)?.forEach(file => {
        const maxDOA = Math.max(...Object.values(fileDOA[file]));
        Object.keys(fileDOA[file]).forEach(author => {
            const authorDOA = fileDOA[file][author];
            const normDOA = authorDOA / maxDOA;
           

            // if (normDOA > k && absoluteDOA >= m) {
            if (authorDOA > 3.293 && authorDOA > 0.75*maxDOA) {
            // if(normDOA > 0.75){
                if (!normalizedDOA[file]) {
                    normalizedDOA[file] = {};
                }
                normalizedDOA[file][author] = normDOA;
                
                if(!normalizedAuthors[author]){
                    normalizedAuthors[author] = [];
                }
                normalizedAuthors[author].push(file)
            }
            if(file){
                totalFiles.add(file)
            }
        });
    });
    
    // console.log("totalFiles:", totalFiles)
    // console.log(normalizedAuthors)
    return {normalizedDOA, normalizedAuthors, totalFiles};
}

// Function to generate a list of top authors
export function getTopAuthors(fileDOA) {
    const authorContribution = {};
    // console.log(fileDOA)

    Object.keys(fileDOA).forEach(file => {
        Object.keys(fileDOA[file]).forEach(author => {
            if (!authorContribution[author]) {
                authorContribution[author] = 0;
            }
            authorContribution[author] += fileDOA[file][author];
        });
    });

    const topAuthors = Object.entries(authorContribution).sort((a, b) => b[1] - a[1]).map(([key, value]) => key);

    return topAuthors;
}

// Truck Factor Algorithm using normalized DOA
export function calculateTruckFactorUsingNormalizedDOA(normalizedAuthors, totalFiles, sortedTopAuthors, coverageThreshold = 0.5) {
    let authorsFiles = normalizedAuthors;
    const systemFiles = totalFiles.size;
    let topAuthors = sortedTopAuthors.slice(); // Use a copy of the sortedTopAuthors array
    let truckFactor = [];
    let future_tf = [];

    while (topAuthors.length > 0) {
        let topAuthor = topAuthors[0];

        if (topAuthor && authorsFiles[topAuthor]) {
            const coverage = (authorsFiles[topAuthor].length || 0) / systemFiles;

            if (coverage >= coverageThreshold) {
                truckFactor.push(topAuthor);
            } else if (coverageThreshold>0.2 && coverage >= (coverageThreshold-0.2) && coverage < coverageThreshold) {
                // we will add future tf is the threshold is more than 0.2 else we will not add future tf
                future_tf.push(topAuthor);
            } else {
                break;
            }
            topAuthors.shift();
        } else {
            topAuthors.shift(); // Remove the author if they don't exist in normalizedAuthors
        }
    }

    return {
        truckFactor,
        future_tf
    };
}