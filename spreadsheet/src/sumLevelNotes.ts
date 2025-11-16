/** Handle parsing skill level notes and getting a sum */
export function sumLevelNotes(notes: string) {
	const counts = notes.split("\n").map(parseLine);
	const sum = counts.reduce((sum, x) => x + sum, 0);
	return sum;
}

function parseLine(note: string) {
	let count = 0;
	const trimmedNote = note.replace(/\([^()]+\)/, "");
	const split = trimmedNote.split(" - ").map((x) => x.trim());
	for (const group of split) {
		if (group.indexOf(",") > -1) {
			count += group.split(",").reduce((prev, x) => (prev += parseLine(x)), 0);
		} else if (group.indexOf("...") > -1) {
			count += parseRange(group);
		} else if (group) {
			count++;
		}
	}
	return count;
}

function parseRange(str: string) {
	const range = str.split("...").map((x) => parseInt(x, 10));
	return range[1]! - range[0]! + 1;
}
