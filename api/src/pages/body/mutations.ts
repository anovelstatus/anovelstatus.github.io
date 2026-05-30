import { hasEntriesFilter, parseDynamicTable } from "../shared";

export function getMutations(info: SpreadsheetInfo) {
	const definition: Table<Body.Modification> = {
		range: info.ss.getRange(info.ranges.Mutations),
		filter: hasEntriesFilter("chapters"),
		fields: [
			{ key: "name", source: { type: "exact", name: "Mutation" }, parse: { type: "string" } },
			{ key: "chapters", source: { type: "exact", name: "Chapters" }, parse: { type: "split_number", limited: true } },
			{ key: "tier", source: { type: "exact", name: "Rarity" }, parse: { type: "string", optional: true } },
			{ key: "type", source: { type: "exact", name: "Type" }, parse: { type: "string" } },
			{ key: "note", source: { type: "exact", name: "Description" }, parse: { type: "string", optional: true } },
			{ key: "source", source: { type: "exact", name: "Source" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
