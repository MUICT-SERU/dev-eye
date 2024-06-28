import chalk from "chalk";
import shell from "shelljs";
import fs from "fs";

const COVERAGE_THRESHOLD = 0.5;

// function isFilePathValid(filePath) {
//     if(!filePath) return false
//     const invalidPrefixes = ["public/", "node_modules/", "package-lock", "yarn.lock",];
//     const invalidSuffixes = [".png", ".jpeg", ".pdf", ".gif", ".ico",".DS_Store"];

//     for (const prefix of invalidPrefixes) {
//         if (filePath?.startsWith(prefix)) {
//             return false;
//         }
//     }

//     for (const suffix of invalidSuffixes) {
//         if (filePath.endsWith(suffix)) {
//             return false;
//         }
//     }

//     return true;
// }

// -	-	wp-includes/js/plupload/plupload.flash.swf
function isFilePathValid(filePath) {
  if (!filePath) return false;

  const invalidPrefixesRegex = /^(node_modules\/|package-lock|yarn\.lock|dist\/|build\/|\.git)/;
  const invalidSuffixesRegex = /\.(png|PNG|SVG|JPEG|jpeg|JPG|jpg|PDF|pdf|GIF|gif|ICO|ico|DS_STORE|ds_store|gitignore)$/i;
  const hasValidExtension = /\.[^/.]+$/.test(filePath);

  return hasValidExtension && !invalidPrefixesRegex.test(filePath) && !invalidSuffixesRegex.test(filePath);
  // if (invalidPrefixesRegex.test(filePath) || invalidSuffixesRegex.test(filePath)) {
  //   return false;
  // }

  // return true;
}

function getLogHistory(dateRange) {
  shell.exec("clear");
  shell.rm("temp.txt");
  console.log(
    chalk
      .hex("#0d9488")
      .bold(
        `\n Welcome to BUS/TRUCK FACTOR Computation\n - This tool computes the bus/truck factor of your project\n - and generates data from git your projects log history,\n - so it might take some time to generate the data \n (about a 30sec or more depending on the size of your project)\n`
      )
  );

  const fileExist = fs.existsSync("temp.txt");

  return new Promise((resolve, reject) => {
    if (!fileExist) {
      shell.exec(`git log --pretty=format:"%h","%an","%ad" --date=short  --until="${dateRange}" --numstat  >> temp.txt`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
        } else {
          let logHistory = shell.cat("temp.txt");
          resolve(formatLogHistory(logHistory));
        }
      });
    } else {
      let logHistory = shell.cat("temp.txt");
      resolve(formatLogHistory(logHistory));
    }
  });
}

const getRepoFiles = (dateUntil) => {
  if (fs.existsSync("Repo_files.txt")) {
    shell.rm("Repo_files.txt");
  }
  return new Promise((resolve, reject) => {
    shell.exec(`git ls-tree HEAD --name-only --full-name -r >> Repo_files.txt`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      } else {
        const repoFiles = shell.cat("Repo_files.txt");
        const validFiles = repoFiles.split("\n").filter((file) => isFilePathValid(file));

        resolve(validFiles);
      }
    });
  });
};

function formatLogHistory(logHistory) {
  // Split the input text by empty lines to separate commits
  const commits = logHistory.split("\n\n");

  const logDetails = [];

  // Process each commit
  commits.forEach((commitText) => {
    // Split each commit text into lines
    const commitLines = commitText.split("\n");

    // Extract commit details from the first line
    const [commit, author, date] = commitLines[0].split(",");

    // Process file changes
    for (let i = 1; i < commitLines.length; i++) {
      const line = commitLines[i].trim();
      if (line) {
        const [added, deleted, file] = commitLines[i].split(/\s+/);
        if (isFilePathValid(file)) {
          logDetails.push({
            commit,
            author: author?.toLowerCase(),
            date,
            added: isNaN(added) ? 0 : added,
            deleted: isNaN(deleted) ? 0 : deleted,
            file,
          });
        }
        // csv += `${commit},${author},${date},${added},${deleted},${file}\n`;
      }
    }
  });

  // console.log(logDetails)

  return logDetails;
}

function getAuthorDetails(commitDetails, fileList) {
  //
  const details = commitDetails?.reduce((result, item) => {
    const author = item?.author;
    if (!result[author]) {
      result[author] = {
        // fileCount: 0, // Initialize fileCount to 0
        files: new Set(),
        coverage: 0,
      };
    }
    result[author]?.files?.add(item.file);
    result[author].coverage = result[author]?.files?.size / fileList?.length;

    return result;
  }, {});
  //    const sortedAuthors= Object.entries(details).map(([author, detail]) => ({ author, coverage: detail.coverage })).sort((a, b) => b.coverage - a.coverage);
  return { authors: Object.keys(details), authorsDetails: details };
}

function getCoverage(authors_name, authorsDetails) {
  return authorsDetails[authors_name]?.coverage;
}

function computeBusFactor(authors, authorsDetails, year) {
  const authorsList = authors;
  let TF = 0;
  const TF_SET = [];
  const Future_TF = [];

  while (authorsList.length != 0) {
    let coverage = getCoverage(authorsList[0], authorsDetails);
    if (coverage < COVERAGE_THRESHOLD) {
      if (coverage >= 0.4) {
        Future_TF.push(authorsList[0]);
      }
      authorsList.shift();
    } else {
      TF++;
      TF_SET.push(authors[0]);
      authorsList.shift();
    }
  }

  console.log(chalk.hex("#0ea5e9").bold(`---- Year:`), chalk.hex("#FFFF00").bold(`${year}`));
  console.log(chalk.hex("#0ea5e9").bold(`---- The Bus Factor is:`), chalk.hex("#FFFF00").bold(`${TF}`));
  console.log(chalk.hex("#0ea5e9").bold(`---- The main devs are:`), chalk.hex("#FFFF00").bold(`${TF_SET.reverse()}\n`));
  if (Future_TF.length > 0) {
    console.log(chalk.hex("#00A36C").bold(`====> Devs to keep an eye on:`), chalk.hex("#FFFF00").bold(`${Future_TF}\n`));
  }

  // defines params and configs
  // display bf by time - time range
  // https://plotly.com/javascript/time-series/
  // compare TF tools and compare their features
  //
}

const sortLogByDate = (logDetails) => {
  const groupedByYear = {};
  const groupedByHalfYear = {};

  const fileGroupedByYear = {};
  const fileGroupedByHalfYear = {};

  let overall = {
    allFiles: [],
    allLogs: logDetails,
  };

  logDetails?.forEach((item) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Adding 1 because getMonth() is zero-based
    const halfYear = month <= 6 ? "1" : "2"; // 1 for Jan-Jun, 2 for Jul-Dec
    const key = `${year}_${halfYear}`;

    const file = item?.file;

    const addToGroup = (group, key, item) => {
      if (!group[key]) {
        group[key] = [];
      }
      group[key].push(item);
    };

    if (isFilePathValid(file)) {
      addToGroup(overall, allFiles, file);
      addToGroup(fileGroupedByYear, year, file);
      addToGroup(fileGroupedByHalfYear, key, file);
      // if(file && !overall.allFiles.includes(file)){
      //     overall.allFiles.push(file);
      // }

      // if (file && !fileGroupedByYear[year].includes(file)) {
      //     fileGroupedByYear[year].push(file);
      // }
      // if (file && !fileGroupedByHalfYear[key].includes(file)) {
      //     fileGroupedByHalfYear[key].push(file);
      // }
    }
    // groupedByYear[year].push(item);
    // groupedByHalfYear[key].push(item);
    addToGroup(groupedByYear, year, item);
    addToGroup(groupedByHalfYear, key, item);
  });

  return { logs: { groupedByYear, groupedByHalfYear }, files: { fileGroupedByYear, fileGroupedByHalfYear }, overall };
};

const getTimeSeriesBusFactor = (logDetails) => {
  const { logs, files, overall } = sortLogByDate(logDetails);

  const { groupedByYear, groupedByHalfYear } = logs;
  const { fileGroupedByYear, fileGroupedByHalfYear } = files;

  const { allLogs, allFiles } = overall;

  console.log({ log: allLogs.length, file: allFiles.length }, "gggg");

  const years = Object.keys(groupedByYear).sort((a, b) => b - a);
  const halfYears = Object.keys(groupedByHalfYear).sort((a, b) => b - a);

  console.log(chalk.hex("#FFFFFF").bold(`-------------------- Overall TF/BF ------------------`));

  const overallDetails = getAuthorDetails(allLogs, allFiles);
  const overallTF = computeBusFactor(overallDetails.authors, overallDetails.authorsDetails, "Overall");

  console.log(chalk.hex("#FFFFFF").bold(`\n-------------------- TF/BF every Year ------------------`));

  const yearBusFactor = years.map((year) => {
    const authors = getAuthorDetails(groupedByYear[year], fileGroupedByYear[year]);
    const busFactor = computeBusFactor(authors.authors, authors.authorsDetails, year);
    return { year, busFactor };
  });

  console.log(chalk.hex("#FFFFFF").bold(`\n-------------------- TF/BF every 6 month ------------------`));
  const halfYearBusFactor = halfYears.map((halfYear) => {
    const authors = getAuthorDetails(groupedByHalfYear[halfYear], fileGroupedByHalfYear[halfYear]);
    const busFactor = computeBusFactor(authors.authors, authors.authorsDetails, halfYear);
    return { halfYear, busFactor };
  });

  // console.log(yearBusFactor, halfYearBusFactor)
  // return {yearBusFactor, halfYearBusFactor}
};

const mainFn = async (dateUntil) => {
  const dateRange = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fileList = await getRepoFiles({
    dateUntil: dateRange,
  });

  fs.writeFile("filesmain.json", JSON.stringify(fileList), function (err) {
    if (err) throw err;
    console.log("Saved!");
  });

  getLogHistory(dateRange)
    .then((logDetails) => {
      getTimeSeriesBusFactor(logDetails);

      const { authors, authorsDetails } = getAuthorDetails(logDetails, fileList);
      console.log({ log: logDetails.length, file: fileList.length }, "main");
      computeBusFactor(authors, authorsDetails, "test");
      // shell.rm('temp.txt')
    })
    .catch((error) => {
      console.log(error);
      shell.rm("temp.txt");
      shell.exit(1);
    });
};
export { mainFn };
