import { getTierRank, sameId } from "@/data/helpers";
import { orderBy, range } from "es-toolkit";

export function getTitleForChapter(tree: MeritTree, chapter: number): Title | undefined {
	return tree.titles.find((title) => title.chapter <= chapter);
}

export function getMeritForChapter(tree: MeritTree, tier: number, chapter: number): TitleMerit | undefined {
	const meritHistory = tree.merits[tier];
	return meritHistory?.find((x) => x.chReveal <= chapter);
}

export function getMeritTrees(titles: Title[], tiers: string[]): MeritTree[] {
	const chains = getTitleChains(titles, tiers);
	console.log(chains);
	const trees: MeritTree[] = [];

	for (const chain of chains) {
		const allMerits = orderBy(
			chain.flatMap((x) => x.merits),
			["chReveal"],
			["desc"],
		);
		const merits = range(10).map((x) => allMerits.filter((merit) => merit.tier === x));
		trees.push({ titles: chain, merits });
	}
	console.log(trees);

	return trees;
}

function getTitleChains(titles: Title[], tiers: string[]): Title[][] {
	const sorted = orderBy(titles, ["chapter", (x) => getTierRank(tiers, x.tier)], ["desc", "desc"]);
	const chains: Title[][] = [];

	while (sorted.length > 0) {
		let title: Title | undefined = sorted.splice(0, 1)[0]!;
		const chain: Title[] = [];
		do {
			chain.push(title);
			const previousIndex = getPrevious(sorted, title);
			if (previousIndex >= 0) {
				title = sorted.splice(previousIndex, 1)[0]!;
			} else title = undefined;
		} while (title);
		chains.push(chain);
	}
	return chains;
}

/** Only necessary in Trees of Merit because of some craziness there. */
function getPrevious(titles: Title[], title: Title): number {
	// If title has an override to itself, stop the chain there.
	if (title.treeOverride && sameId(title, title.treeOverride)) return -1;
	// If there's an override to anything else, find that one as the previous title.
	if (title.treeOverride) return titles.findIndex((x) => sameId(x, title.treeOverride!));
	// Otherwise fallback to the normal flow.
	if (!title.previous) return -1;
	return titles.findIndex((t) => sameId(t, title.previous!));
}
