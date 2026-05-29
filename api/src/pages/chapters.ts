import { getTiers } from "./tiers";

/** Get latest chapter number released to the public */
export function getRoyalRoadChapter(ss: Spreadsheet) {
	return ss.getRangeByName("RoyalRoadChapter")!.getValue() as number;
}
/** Get latest chapter number released to patrons */
export function getPatreonChapter(ss: Spreadsheet) {
	return ss.getRangeByName("PatreonChapter")!.getValue() as number;
}

export function getPatreonSheetLink(ss: Spreadsheet) {
	return ss.getRangeByName("PatreonSheetLink")!.getValue() as string;
}

export function getConfiguration(info: SpreadsheetInfo): BasicInfo {
	const tiers = getTiers(info);
	return {
		latest: info.chapterLimit,
		tiers: tiers,
		unlocked: info.includePatreon,
		patreonSheetLink: info.includePatreon ? getPatreonSheetLink(info.ss) : undefined,
	};
}
