import { ChapterContext } from "@/providers";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
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

export function useBasicInfo() {
	return useSpreadsheet<BasicInfo>("chapters", { latest: 1, unlocked: false, tiers: [] });
}

export function useShortcuts() {
	return useSpreadsheet<Shortcut[]>("shortcuts", []);
}

export function useBody() {
	return useSpreadsheet<Body.Details>("body", {
		bloodlines: [],
		mutations: [],
		races: [],
	}).data;
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

function useStatuses() {
	return useSpreadsheet<Status[]>("statuses", []);
}

export function useStatusDictionary() {
	const { data: statuses } = useStatuses();
	return useMemo(() => {
		return Object.fromEntries(statuses.map((x) => [x.chapter, x]));
	}, [statuses]);
}

// Copying type constraint from Tanstack's NonFunctionGuard type
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function useSpreadsheet<T>(page: string, placeholder: T extends Function ? never : T) {
	return useQuery<T>({
		queryKey: ["page", page],
		placeholderData: placeholder,
	}) as GuaranteedQueryResult<T>;
}
