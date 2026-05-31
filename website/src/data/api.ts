import { ChapterContext } from "@/providers";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { maxBy, orderBy } from "es-toolkit";
import { useContext, useMemo } from "react";

/** Make data not optional because we can guarantee a placeholder */
type GuaranteedQueryResult<T> = UseQueryResult<T> & {
	data: T;
};

export function useChapter() {
	const { chapter } = useContext(ChapterContext);
	return chapter < 1 ? 1 : chapter;
}

export function useIsUnlocked() {
	const { data } = useBasicInfo();
	return data.unlocked;
}

export function useLatestChapter() {
	const { data } = useBasicInfo();
	return data.latest;
}

export function useSkillTiers() {
	const { data } = useBasicInfo();
	return data.tiers.map((x) => x.skillName);
}

export function useMetalTiers() {
	const { data } = useBasicInfo();
	return data.tiers.map((x) => x.metalName);
}

export function useBasicAttributes() {
	const { data, isFetching } = useBasicInfo();
	return { data: data.attributes, isFetching };
}

export function useBasicInfo() {
	return useSpreadsheet<BasicInfo>("chapters", {
		latest: 1,
		unlocked: false,
		tiers: [],
		shortcuts: [],
		attributes: [],
	});
}

function useBody() {
	return useSpreadsheet<Body.Details>("body", {
		bloodlines: [],
		mutations: [],
		races: [],
		tempering: [],
	}).data;
}

export function useBloodlines() {
	return useBody().bloodlines;
}

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

export function useBodyMutations() {
	return useBody().mutations;
}

export function useBodyMutationsOnChapter(chapter: number) {
	const all = useBodyMutations();
	const filtered = all.filter((x) => x.chapters.some((ch) => ch <= chapter));
	const sorted = orderBy(filtered, [(x) => x.chapters[0]], ["asc"]);
	return sorted;
}

export function useBodyTempering() {
	return useBody().tempering;
}

export function useBodyTemperingForChapter(chapter: number) {
	const stages = useBodyTempering() || [];

	const filtered = stages.filter((x) => x.chapter <= chapter);
	if (!filtered.length) return [];

	return orderBy(filtered, [(x) => x.chapter], ["asc"]);
}

/** Race history in descending chapter and tier order */
export function useRaces() {
	const races = useBody().races;
	return orderBy(races, [(x) => x.chapter, (x) => x.tier], ["desc", "desc"]);
}

export function useRaceOnChapter(chapter: number): Race | undefined {
	const races = useRaces();
	chapter = chapter || 0;
	return races.filter((x) => x.chapter <= chapter)[0];
}

export function useTalents() {
	return useSpreadsheet<Talent[]>("talents", []);
}

export function useTitles() {
	return useSpreadsheet<Title[]>("titles", []);
}

export function useAttributes() {
	return useSpreadsheet<Attribute.Details[]>("attributes", []);
}

export function useGroupedAttributes() {
	const { data: attributes } = useAttributes();
	const groups = Map.groupBy(attributes, (x) => x.category);
	return Array.from(groups);
}

export function useSkills() {
	return useSpreadsheet<Skill[]>("skills", []);
}

export function useAchievements() {
	return useSpreadsheet<Achievement[]>("achievements", []);
}

function useStatuses() {
	return useSpreadsheet<Status[]>("statuses", []);
}

export function useStatusDictionary() {
	const { data: statuses } = useStatuses();
	return useMemo(() => {
		return Object.fromEntries(statuses.map((x) => [x.chapter, x]));
	}, [statuses]);
}

function useLore() {
	return useSpreadsheet<LoreEntry[]>("lore", []);
}

export function useLoreTopic(key: string, chapter: number) {
	const { data: lore } = useLore();
	const latestDescription =
		maxBy(
			lore.filter((x) => x.key === key && x.chapter <= chapter && !x.permanent),
			(x) => x.chapter,
		)?.note || [];
	const updates = orderBy(
		lore.filter((x) => x.key === key && x.chapter <= chapter && x.permanent),
		[(x) => x.chapter],
		["desc"],
	);
	return { description: latestDescription, updates };
}

// Copying type constraint from Tanstack's NonFunctionGuard type
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function useSpreadsheet<T>(page: ApiPage, placeholder: T extends Function ? never : T) {
	return useQuery<T>({
		queryKey: ["page", page],
		placeholderData: placeholder,
	}) as GuaranteedQueryResult<T>;
}
