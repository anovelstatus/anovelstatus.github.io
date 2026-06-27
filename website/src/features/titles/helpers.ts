import { sameId } from "@/data/helpers";

export function getPreviousTitle(titles: Title[], title: Title): Title | undefined {
	if (!title.previous) return;
	return titles.find((t) => sameId(t, title.previous!));
}

export function getPreviousTitleChain(titles: Title[], title: Title): Title[] {
	if (!title) return [];

	const list = [];
	let current: Title | undefined = title;
	while (current) {
		current = getPreviousTitle(titles, current);
		if (current) list.push(current);
	}
	return list;
}
