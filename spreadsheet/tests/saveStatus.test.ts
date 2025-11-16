import { describe, expect, test } from "vitest";
import { mapToRow } from "../src/saveStatus";

describe("sumLevelNotes", () => {
	test("Attributes map to expected numbers", () => {
		const attributeNames = ["First", "Third", "Seventh", "Ninth", "Eleventh", "Twelfth"] as unknown as string[];
		const status = `
Status:

PHYSICAL:
First (A) 1 317
Second 2 448
Third 3 404
Fourth (B) 465
Fifth 521

MENTAL:
Sixth 282
Seventh (C) 345 (+10)
Eighth 72
Ninth 464 (+10)
Tenth 378

META:
Eleventh 77 (-10)
	`;
		const chapter = 40;
		const expected = [chapter, 1317, 3404, 345, 464, 77, 0];
		const actual = mapToRow(chapter, attributeNames, status);
		expect(actual).toStrictEqual(expected);
	});
});
