import { getTimelineShortcuts } from "./shortcuts";
import { getTiers } from "./tiers";

/** Get latest chapter number released to the public */
export function getRoyalRoadChapter(ss: Spreadsheet) {
	return ss.getRangeByName("RoyalRoadChapter")!.getValue() as number;
}
/** Get latest chapter number released to patrons */
export function getPatreonChapter(ss: Spreadsheet) {
	return ss.getRangeByName("PatreonChapter")!.getValue() as number;
}

function getPatreonSheetLink(ss: Spreadsheet) {
	return ss.getRangeByName("PatreonSheetLink")!.getValue() as string;
}

export function getConfiguration(info: SpreadsheetInfo): BasicInfo {
	return {
		latest: info.chapterLimit,
		tiers: getTiers(info),
		unlocked: info.includePatreon,
		patreonSheetLink: info.includePatreon ? getPatreonSheetLink(info.ss) : undefined,
		shortcuts: getTimelineShortcuts(info),
	};
}
