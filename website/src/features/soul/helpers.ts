import { useSoul } from "@/data/api";

export function useSoulTierOnChapter(chapter: number): number {
	const soul = useSoul();
	const tiers = soul.data.highTribulations.filter((x) => x.done && x.chapter <= chapter).map((x) => x.tier);
	if (!tiers.length) return 0;
	return Math.max(...tiers);
}
