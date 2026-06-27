import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { orderBy, range } from "es-toolkit";
import { useContext } from "react";
import { ChapterContext } from "./ChapterContext";

/** Make data not optional because we can guarantee a placeholder */
type GuaranteedQueryResult<T> = UseQueryResult<T> & {
	data: T;
};

export type LoadableData<T> = { isLoading: boolean; data: T };

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

export function useTimelineShortcuts(): LoadableData<Shortcut[]> {
	const { data } = useBasicInfo();
	return { data: data.shortcuts, isLoading: data.shortcuts.length == 0 };
}

export function useBasicInfo() {
	return useQuery<BasicInfo>({
		queryKey: ["page", "chapters"],
		placeholderData: {
			latest: 1,
			unlocked: false,
			// Placeholder tiers for when page data is loaded before this, somehow
			tiers: range(10).map(
				(i): TierInfo => ({ metalName: "?", skillName: "?", tier: i, bgColor: "#000", fgColor: "#fff" }),
			),
			shortcuts: [],
			attributes: [],
		},
	}) as GuaranteedQueryResult<BasicInfo>;
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

export function useBodyMutations() {
	return useBody().mutations;
}

export function useBodyTempering() {
	return useBody().tempering;
}

/** Race history in descending chapter and tier order */
export function useRaces() {
	const races = useBody().races;
	return orderBy(races, [(x) => x.chapter, (x) => x.tier], ["desc", "desc"]);
}

export function useSoul() {
	return useSpreadsheet<SoulDetails>("soul", { supremacies: {} });
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

export function useSkills() {
	return useSpreadsheet<Skill[]>("skills", []);
}

export function useAchievements() {
	return useSpreadsheet<Achievement[]>("achievements", []);
}

export function useStatuses() {
	return useSpreadsheet<OfficialStatus[]>("statuses", []);
}

export function useLore() {
	return useSpreadsheet<LoreEntry[]>("lore", []);
}

// Copying type constraint from Tanstack's NonFunctionGuard type
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function useSpreadsheet<T>(page: ApiPage, placeholder: T extends Function ? never : T): LoadableData<T> {
	const result = useQuery<T>({
		queryKey: ["page", page],
		placeholderData: placeholder,
	}) as GuaranteedQueryResult<T>;

	return { data: result.data, isLoading: result.isPlaceholderData };
}
