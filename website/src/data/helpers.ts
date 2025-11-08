import { maxBy } from "es-toolkit";

export function formatNumber(num: number | undefined) {
	return num?.toLocaleString() ?? "";
}

export function getRaceForChapter(races: Race[], chapter: number): Race {
	chapter = chapter || 0;
	return maxBy(
		races.filter((x) => x.chapter <= chapter),
		(x) => x.chapter,
	)!;
}

export function getCurrentLevel(skill: Skill, chapter: number) {
	return sum(
		skill.gains.filter((x) => x.chapter <= chapter),
		(x) => x.count,
	);
}

export const toIdString = (item?: TieredId) => (!item ? "?" : item.name + " - " + item.tier);

export const sameId = <T extends TieredId>(a: T, b: T) => a.name == b.name && a.tier == b.tier;

export function findByIds<T extends TieredId>(talents: T[], previous?: TieredId[]): T[] {
	if (!previous) return [];
	return previous.map((x): T => {
		let match = talents.find((t) => t.name == x.name && t.tier == x.tier);
		// special search for growth talents
		if (!match) {
			match = talents.find((t) => t.name == x.name && x.tier.startsWith(t.tier));
		}
		return match as T;
	});
}

export function mapMapValues<TKey, TValue, TNewValue>(
	original: Map<TKey, TValue>,
	convertValue: (obj: TValue) => TNewValue,
) {
	const map = new Map<TKey, TNewValue>();
	for (const [key, value] of original) {
		const newValue = convertValue(value);
		map.set(key, newValue);
	}
	return map;
}

export function sum<T>(arr: T[], getField?: (obj: T) => number): number {
	if (!getField) getField = (obj) => obj as number;
	return arr.reduce((prev, curr) => getField(curr) + prev, 0);
}
