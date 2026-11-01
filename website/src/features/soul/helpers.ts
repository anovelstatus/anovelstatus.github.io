import { useSoul } from "@/data/api";
import { useMemo } from "react";

export function useSoulTierOnChapter(chapter: number): number {
	const { data } = useSoul();
	return useMemo(() => {
		const tiers = data.highTribulations.filter((x) => x.done && x.chapter <= chapter).map((x) => x.tier);
		if (!tiers.length) return 0;
		return Math.max(...tiers);
	}, [data, chapter]);
}
