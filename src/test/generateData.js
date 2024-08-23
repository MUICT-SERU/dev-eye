import fs from "fs";
import path from "path";
import { dirname } from "path";

// List of common files
const commonFiles = [
  "CHANGELOG.md",
  "package.json",
  "src/cli/lib/tf_functions.js",
  "src/components/barChart-tf-ft.js",
  "src/components/barChart.js",
  "src/index.js",
  ".gitignore",
  ".vscode/settings.json",
  "dev-eye.json",
  "prettier.config.js",
];

// Helper function to generate random file changes
function generateFileChanges(files) {
  const changes = [];
  const randomCount = Math.floor(Math.random() * files.length) + 1;
  const selectedFiles = files.sort(() => 0.5 - Math.random()).slice(0, randomCount);

  selectedFiles.forEach((file) => {
    const additions = Math.floor(Math.random() * 36);
    const deletions = Math.floor(Math.random() * 36);
    changes.push(`${additions}\t${deletions}\t${file}`);
  });

  return changes;
}

// Function to generate commit data and write to a file
function generateCommitData(usersCommits, userFiles, filename = "log.txt") {
  const commitData = [];
  const currentDate = new Date();

  // Generate commit logs for each user
  Object.entries(usersCommits).forEach(([user, numCommits]) => {
    const email = `${user}@users.noreply.github.com`;
    const userSpecificFiles = userFiles[user] || [];
    const files = Array.from(new Set([...commonFiles, ...userSpecificFiles]));

    for (let i = 0; i < numCommits; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      const formattedDate = date.toISOString().split("T")[0];
      commitData.push(`${user} | ${formattedDate} | ${email}`);
      commitData.push(...generateFileChanges(files));
      commitData.push(""); // Add an empty line for separation
    }
  });

  // Write the commit data to the specified file
  fs.writeFileSync(filename, commitData.join("\n"), "utf8");
  // console.log(commitData)
}

// Example usage
const usersCommits = {
  khazifire: 3,
  John: 2,
  mix: 10,
  mark: 5,
};

// Specify which files each user created
const userFiles = {
  khazifire: ["src/index.js", "src/components/barChart.js"],
  John: ["package.json", ".gitignore"],
};

generateCommitData(usersCommits, userFiles);
