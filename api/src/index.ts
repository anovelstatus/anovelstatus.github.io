import "./global.d.ts";
import "../../shared/types.d.ts";
import { updateSpecificFiles } from "./updater.js";

/* @ts-expect-error no-unused-local */
function doGet(e: GoogleAppsScript.Events.DoGet) {
	let content = "";
	console.log(e);
	try {
		const page = e.parameter["page"] as ApiPage;
		const includePatreon = e.parameter["key"] === PATREON_KEY;
		const file = getFile(includePatreon, page);
		content = file.getDataAsString();
	} catch (err: Error | unknown) {
		console.log(err);
		if (err instanceof Error) content = err.message;
		else content = JSON.stringify(err);
	}
	return ContentService.createTextOutput(content);
}

/** Used for testing getting data from the API */
/* @ts-expect-error no-unused-local */
function debug() {
	const test = getFile(true, "statuses");
	console.log(test);
}

/** Used for testing getting data from the spreadsheet */
/* @ts-expect-error no-unused-local */
function debugUpdateFile() {
	const ss = SpreadsheetApp.openByUrl(SS_LINK);
	updateSpecificFiles(ss, ["statuses"]);
}

/** Used in trigger to update pre-generated responses */
/* @ts-expect-error no-unused-local */
function updateFiles() {
	console.log("Checking last modified dates");
	const tenMinutesAgo = new Date(new Date().valueOf() - 10 * 1_000 * 60);

	const ss = SpreadsheetApp.openByUrl(SS_LINK);
	const ssLastUpdated = DriveApp.getFileById(ss.getId()).getLastUpdated();
	console.log("Spreadsheet last modified at " + ssLastUpdated.toISOString());

	if (ssLastUpdated <= tenMinutesAgo) {
		console.log("Skipping update, since spreadsheet was modified before " + tenMinutesAgo.toISOString());
		return;
	}
	console.log("Updating...");
	updateAllFiles(ss);
}

/** Used to manually force a refresh. Useful if the response model changes, for example. */
function updateAllFiles(ss?: Spreadsheet) {
	if (!ss) ss = SpreadsheetApp.openByUrl(SS_LINK);
	const allPages: ApiPage[] = [
		"chapters",
		"achievements",
		"attributes",
		"body",
		"lore",
		"skills",
		"soul",
		"statuses",
		"talents",
		"titles",
	];
	updateSpecificFiles(ss, allPages);
}

/** Get contents of JSON file in folder */
function getFile(includePatreon: boolean, page: string): GoogleAppsScript.Base.Blob {
	const folder = DriveApp.getFolderById(includePatreon ? PATREON_FOLDER : RR_FOLDER);
	const fileResults = folder.getFilesByName(page + ".json");
	if (fileResults.hasNext()) return fileResults.next().getBlob();
	throw new Error(page + " not found");
}
