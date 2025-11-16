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
