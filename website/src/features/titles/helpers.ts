import { sameId } from "@/data/helpers";

export function getPreviousTitle(titles: Title[], title: Title): Title | undefined {
	if (!title.previous) return;
	return titles.find((t) => sameId(t, title.previous!));
}

export function getPreviousTitleChain(titles: Title[], title: Title, useOverride: boolean = false): Title[] {
	if (!title) return [];

	const list = [];
	let current: Title | undefined = title;
	while (current) {
		current = useOverride ? getPreviousOrOverrideTitle(titles, current) : getPreviousTitle(titles, current);
		if (current) list.push(current);
	}
	return list;
}

/** Only necessary in Trees of Merit because of some craziness there. */
function getPreviousOrOverrideTitle(titles: Title[], title: Title): Title | undefined {
	// If title has an override to itself, stop the chain there.
	if (title.treeOverride && sameId(title, title.treeOverride)) return;
	// If there's an override to anything else, find that one as the previous title.
	if (title.treeOverride) return titles.find((x) => sameId(x, title.treeOverride!));
	// Otherwise fallback to the normal flow.
	return getPreviousTitle(titles, title);
}
