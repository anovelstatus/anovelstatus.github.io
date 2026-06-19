import { useBloodlines, useBodyMutations, useBodyTempering, useRaces } from "@/data/api";
import { orderBy } from "es-toolkit";

export function useBloodlinesOnChapter(chapter: number) {
	const all = useBloodlines();
	return all
		.map((x): Bloodline => {
			return {
				...x,
				updates: x.updates.filter((y) => y.chapter <= chapter),
			};
		})
		.filter((x) => x.updates.length > 0);
}

export function useBodyMutationsOnChapter(chapter: number) {
	const all = useBodyMutations();
	const filtered = all.filter((x) => x.chapters.some((ch) => ch <= chapter));
	const sorted = orderBy(filtered, [(x) => x.chapters[0]], ["asc"]);
	return sorted;
}
export function useBodyTemperingForChapter(chapter: number) {
	const stages = useBodyTempering() || [];

	const filtered = stages.filter((x) => x.chapter <= chapter);
	if (!filtered.length) return [];

	return orderBy(filtered, [(x) => x.chapter], ["asc"]);
}

export function useRaceOnChapter(chapter: number): Race | undefined {
	const races = useRaces();
	chapter = chapter || 0;
	return races.filter((x) => x.chapter <= chapter)[0];
}
