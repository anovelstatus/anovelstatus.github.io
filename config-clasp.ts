import { writeFileSync, existsSync, statSync } from "fs";
import dotenv from "dotenv";
import { exit } from "process";

const [_nodePath, _scriptPath, projectFolder] = process.argv;

// Make sure a valid project is being configured
if (!projectFolder) {
	console.error("Provide the project folder as an argument (api or spreadsheet).");
	exit(1);
}

if (!existsSync(`${projectFolder}/dist`)) {
	console.error(`The ${projectFolder}/dist/ does not exist. Build the project before deploying.`);
	exit(1);
}
console.log(`Configuring project in folder: ${projectFolder}`);

// Prefer environment variables from .env file, but fall back to environment in GitHub Actions
const envPath = `.env.${projectFolder}`;
if (existsSync(envPath)) {
	console.log(`Loading environment variables from ${envPath}`);
	dotenv.config({ path: envPath, quiet: true });
} else {
	console.log("Using Clasp configuration already in environment variables.");
}

// Create a temporary .clasp.json file for project
const configPath = `${projectFolder}/dist/.clasp.json`;
const claspConfig = JSON.stringify({
	$schema: "https://json.schemastore.org/clasp.json",
	scriptId: process.env["SCRIPT_ID"],
});

console.log(`Creating ${configPath}`);
writeFileSync(configPath, claspConfig);
if (!existsSync(configPath)) {
	console.error("Failed to create .clasp.json file.");
	exit(1);
}
const stats = statSync(configPath);
if (stats.size === 0) {
	console.error(".clasp.json file is empty.");
	exit(1);
}

// Create login credentials
const rcPath = `${process.env["HOME"]}/.clasprc.json`;
const rcContent = process.env["CLASPRC"];
if (rcContent) {
	console.log(`Creating ${rcPath}`);
	writeFileSync(rcPath, atob(rcContent));
}
if (!existsSync(rcPath)) {
	console.error("Failed to create .clasprc.json file or you have not run clasp login.");
	exit(1);
}

console.log("Done with setup.");
