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

export function getConfiguration(
	includePatreon: boolean,
	spreadsheet: Spreadsheet,
	ranges: RangeLookup,
	attributeNames: string[],
	chapterLimit: number,
): BasicInfo {
	const tiers = getTiers(spreadsheet, ranges, attributeNames, chapterLimit);
	return {
		latest: chapterLimit,
		tiers: tiers,
		unlocked: includePatreon,
		patreonSheetLink: includePatreon ? getPatreonSheetLink(spreadsheet) : undefined,
	};
}
