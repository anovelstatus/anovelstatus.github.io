import { describe, expect, test } from "vitest";
import { sumLevelNotes } from "../src/sumLevelNotes";

describe("sumLevelNotes", () => {
	const cases: [string, number][] = [
		["1", 1],
		["1 - 2", 2],
		["1 - 2,3", 3],
		["1 - 2,3,4", 4],
		["1 - 2,3,4 - 5,6,7", 7],
		["1 - 2,3,4 - 5...22", 22],
		["1 - 2...6", 6],
		['1 ("delayed" but gets Level 2 much later)', 1],
		["1 (no level for Resilient Will - Epic) - 2", 2],
		["1...7", 7],
		["1, 2...5 - 6...9", 9],
		["1,2", 2],
		["1,2,3", 3],
		["1...11", 11],
		["1...4", 4],
		["1...5 (gained Ch19 but credited on Ch20)", 5],
		["10,11 - 12...19", 10],
		["10,11,12 - 13 - 14", 5],
		["10,11,12,13 - 14,15 - 16,17,18 - 19", 10],
		["11 - 12 - 13 - 14 - 15 - 16...19", 9],
		["11,12 - 13 - 14,15,16,17 (rift + Death 14)", 7],
		["11,12,13 - 14", 4],
		["13 - 14 - 15 - 16 - 17...20", 8],
		["13,14 - 15 - 16 - 17 - 18 - 19 - 20", 8],
		["13,14,15 - 16", 4],
		["13,14,15,16", 4],
		["14,15 - 16,17", 4],
		["16 - 17 - 18,19 - 20 - 21,22", 7],
		["16,17,18 - 19", 4],
		["16...20 - 21...25", 10],
		["2 - 1 (yes, 2 came first in the chapter)", 2],
		["2 - 3 - 4 - 5", 4],
		["2 - 3 - 4 - 5 - 6,7,8 - 9", 8],
		["29...35 (Fused with Mask lvl 5) - 36...39", 11],
		['36 - 37 (same chapter as "12 stats above 200")', 2],
		["40 (Domain and Concept)", 1],
		["6,7,8 (quest reward) - 9 - 10 - 11 - 12", 7],
		["9 (should be 10)", 1],
		["(Placeholder to remind you that Negotiation was Mercury's skill)", 0],
		["11...-1 (Undo all)", -11],
	];
	test.each(cases)("comment '%s' equals %d levels", (input, expected) => {
		const actual = sumLevelNotes(input);
		expect(actual).toBe(expected);
	});
});
