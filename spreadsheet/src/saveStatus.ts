/** Handle parsing skill level notes and getting a sum */
export function saveStatus(status: string, chapter: number) {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Statuses")!;

	// Get the attribute names, in the order they're listed in the spreadsheet
	const attributeNames = sheet.getRange("B2:Q2").getValues()[0] as string[];
	const newRow = mapToRow(chapter, attributeNames, status);

	// And save it
	sheet.getRange(chapter + 2, 1, 1, newRow.length).setValues([newRow]);
}

/** Turn the given text into a new row of values */
export function mapToRow(chapter: number, attributeNames: string[], status: string) {
	const lines = status.split("\n");
	return [chapter, ...attributeNames.map((x) => getValue(x, lines))];
}

function getValue(attribute: string, lines: string[]) {
	const line = getLine(attribute, lines);
	// Early statuses don't have all the lines, so default to 0
	return line ? parseStat(line) : 0;
}

function getLine(attribute: string, lines: string[]) {
	return lines.find((x) => x.includes(attribute));
}

function parseStat(line: string): number {
	// Parse "1234" out of a line like this:
	// Name-of-stat 1 234 (+50)
	const matches = /[0-9]+ ?[0-9]+/.exec(line)!;
	const num = matches[0].replaceAll(" ", "");
	return parseInt(num, 10);
}
