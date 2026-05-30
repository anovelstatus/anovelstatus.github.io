import { parseNumber, parseString } from "./shared";
import { getTimelineShortcuts } from "./shortcuts";
import { getTiers } from "./tiers";

/** Get latest chapter number released to the public */
export function getRoyalRoadChapter(ss: Spreadsheet) {
	return parseNumber(ss.getRangeByName("RoyalRoadChapter")!.getValue());
}
/** Get latest chapter number released to patrons */
export function getPatreonChapter(ss: Spreadsheet) {
	return parseNumber(ss.getRangeByName("PatreonChapter")!.getValue());
}

function getPatreonSheetLink(ss: Spreadsheet) {
	return parseString(ss.getRangeByName("PatreonSheetLink")!.getValue());
}

export function getConfiguration(info: SpreadsheetInfo): BasicInfo {
	return {
		latest: info.chapterLimit,
		tiers: getTiers(info),
		unlocked: info.includePatreon,
		patreonSheetLink: info.includePatreon ? getPatreonSheetLink(info.ss) : undefined,
		shortcuts: getTimelineShortcuts(info),
		attributes: info.attributes.map((x) => ({
			name: x.name,
			abbreviation: x.abbreviation,
			category: x.category,
			categoryAbbreviation: x.categoryAbbreviation,
		})),
	};
}
