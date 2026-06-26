import { chapterFilter, getEntireSheet, limitObjects, limitValue, mapTable, sameId } from "../parser";

type InternalMerit = TitleMerit & { title: TieredId };

/** Get list of Titles and their metadata. This does NOT include metadata for attribute boosts. That is loaded separately. */
export function getTitles(info: SpreadsheetInfo) {
	const merits = getMerits(info);

	const range = getEntireSheet(info, "Titles");
	const fields: Fields<Title> = [
		{ key: "name|tier", source: { type: "exact", name: "Title" }, parse: "tiered_id" },
		{ key: "note", source: { type: "exact", name: "Description" }, parse: "string" },
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "previous", source: { type: "exact", name: "Previous" }, parse: "tiered_id", optional: true },
		{ key: "replaced", source: { type: "exact", name: "Chapter Replaced" }, parse: "number", optional: true },
		{
			key: "merits",
			parse: ({ rowSoFar }) =>
				merits
					.filter((x) => sameId(x.title, rowSoFar as TieredId))
					.map((merit) => ({
						...merit,
						title: undefined,
					})),
		},
	];

	return mapTable(info, range, fields);
}

export function getMerits(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "Merits");
	const fields: Fields<InternalMerit> = [
		{ key: "tier", source: { type: "exact", name: "Merit Tier" }, parse: "number" },
		{ key: "title", source: { type: "exact", name: "Title" }, parse: "tiered_id" },
		{ key: "text", source: { type: "exact", name: "Description" }, parse: "rich" },
		{ key: "chReveal", source: { type: "exact", name: "Chapter Revealed" }, parse: "number" },
		{ key: "chBought", source: { type: "exact", name: "Chapter Bought" }, parse: "number", optional: true },
		{ key: "notes", source: { type: "exact", name: "Note" }, parse: "chapter_note", optional: true },
	];

	return mapTable(info, range, fields);
}

export function limitTitles(data: Title[], info: LimiterInfo) {
	return data.filter(chapterFilter(info.chapterLimit, "chapter")).map((x) => {
		return {
			...x,
			replaced: limitValue(x.replaced, info.chapterLimit),
			merits: limitMerits(x.merits, info),
		};
	});
}

export function limitMerits(data: TitleMerit[], info: LimiterInfo) {
	return data.filter(chapterFilter(info.chapterLimit, "chReveal")).map((x) => {
		return {
			...x,
			chBought: limitValue(x.chBought, info.chapterLimit),
			notes: limitObjects(x.notes, info.chapterLimit, "ch"),
		};
	});
}
