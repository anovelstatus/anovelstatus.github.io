import { useChapter } from "@/data/api";
import { toPlainText } from "@/data/helpers";
import { useMemo } from "react";

export function useFilteredItems<T>(
	query: string[],
	items: T[],
	keys: PlainOrRichTextKeys<T>[],
	showOnChapter: (item: T, chapter: number) => boolean,
) {
	const chapter = useChapter();
	return useMemo(() => {
		if (!query || !query.length) return [];
		return filterItems(query, items, keys, chapter, showOnChapter);
	}, [items, query, chapter]);
}

function filterItems<T>(
	query: string[],
	items: T[],
	keys: PlainOrRichTextKeys<T>[],
	chapter: number,
	showOnChapter: (item: T, chapter: number) => boolean,
) {
	const matches: T[] = [];
	for (const item of items) {
		if (!showOnChapter(item, chapter)) continue;

		const results = query.map((x): [string, boolean] => [x, false]);
		for (const key of keys) {
			const fieldText = toPlainText(item[key] as unknown as RichTextSpans).toLowerCase();
			for (const result of results.filter((x) => !x[1]))
				if (fieldText.includes(result[0])) {
					result[1] = true;
				}
		}
		if (results.every((x) => x[1])) matches.push(item);
	}
	return matches;
}
