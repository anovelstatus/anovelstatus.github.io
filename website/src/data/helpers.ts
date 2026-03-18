export function formatNumber(num: number | undefined) {
	return num?.toLocaleString() ?? "";
}

export function getRaceForChapter(races: Race[], chapter: number): Race {
	chapter = chapter || 0;
	return races.filter((x) => x.chapter <= chapter)[0]!;
}

export function getCurrentLevel(skill: Skill, chapter: number) {
	return sum(
		skill.gains.filter((x) => x.chapter <= chapter),
		(x) => x.count,
	);
}

export function getTierRank(tiers: string[], tier: string): number {
	return tiers.findIndex((x) => tier.startsWith(x));
}

export const toIdString = (item?: TieredId) => (!item ? "?" : item.name + " - " + item.tier);

export const sameId = <T extends TieredId>(a: T, b: T) => a.name == b.name && a.tier == b.tier;

export function findByIds<T extends TieredId>(list: T[], previous?: TieredId[]): T[] {
	if (!previous) return [];
	return (
		previous
			.map((x): T | undefined => {
				let match = list.find((t) => t.name == x.name && t.tier == x.tier);
				// special search for growth talents
				if (!match) {
					match = list.find((t) => t.name == x.name && x.tier.startsWith(t.tier));
				}
				return match;
			})
			// Filter out any that we couldn't find because the chapter is too low for all linked items
			.filter((x): x is T => !!x)
	);
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

/** Parse something like `Name - Tier` into a name and tier */
export function parseId(fullName: string): TieredId {
	const parts = fullName.split(" - ");
	// Get the last segment instead of assuming only 2 parts because at least one Talent has a dash in its name
	const tier = parts.pop() as string;
	const name = parts.join(" - ");
	return { name, tier };
}
