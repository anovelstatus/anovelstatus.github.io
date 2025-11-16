import "./global.d.ts";
import "../../shared/types.d.ts";
import { getPage } from "./pages/index.js";

/**
 * Randomly-generated string that users should paste into the website
 * in order to get not just public Royal Road info, but also the Patreon info.
 */
declare const PATREON_KEY: string;

declare const SS_LINK: string;

const cache = CacheService.getScriptCache()!;
const ss = SpreadsheetApp.openByUrl(SS_LINK);

/* @ts-expect-error no-unused-local */
function doGet(e: GoogleAppsScript.Events.DoGet) {
	let content = "";
	console.log(e);
	try {
		const page = e.parameter["page"] as Page;
		const includePatreon = e.parameter["key"] === PATREON_KEY;
		const data = getPage(ss, page, includePatreon, false);
		content = JSON.stringify(data);
	} catch (err: Error | unknown) {
		console.log(err);
		if (err instanceof Error) content = err.message;
		else content = JSON.stringify(err);
	}
	return ContentService.createTextOutput(content);
}

/* @ts-expect-error no-unused-local */
function clearCache() {
	const keys: CacheKey[] = [
		"table-ranges",
		"attributes",
		"body",
		"chapters",
		"shortcuts",
		"skills",
		"statuses",
		"talents",
		"titles",
	];
	cache.removeAll(keys);
}

/** Used for testing getting data from the spreadsheet */
/* @ts-expect-error no-unused-local */
function debug() {
	const page = "skills";
	const test = getPage(ss, page, true, true);
	console.log(test);
}
