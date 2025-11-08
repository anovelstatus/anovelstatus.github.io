import { sameId } from "@/data/helpers";

export function getPreviousTitle(titles: Title[], title: Title): Title | undefined {
	if (!title.previous) return;
	const previous = title.previous;

	return titles.find((t) => sameId(t, previous));
}

export function getPreviousTitleChain(titles: Title[], title: Title): Title[] {
	if (!title || !title.previous) return [];

	const list = [];
	let current: Title | undefined = title;
	while (current?.previous) {
		current = getPreviousTitle(titles, current);
		if (current) list.push(current);
	}
	return list;
}
