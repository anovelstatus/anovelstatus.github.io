import { sum } from "@/data/helpers";

export function getEvolvedName(attribute: Attribute.Details, status: Status): string {
	const evolution = getCurrentEvolution(status, attribute);
	const suffix = evolution?.name ? ` (${evolution.name[0]})` : "";
	return attribute.name + suffix;
}

export function getStatus(statuses: Status[], chapter: number): Status | undefined {
	return statuses.findLast((x) => x.chapter <= chapter);
}

export function getImprovementsFromPreviousStatus(
	attributes: Attribute.Details[],
	status: Status,
	previousStatus?: Status,
): HasSomeAttributes {
	const difference = {} as HasSomeAttributes;
	if (previousStatus) {
		for (const { name } of attributes) {
			difference[name] = status[name]! - previousStatus[name]!;
		}
	}
	return difference;
}

export function getPastMilestones(status?: Status, attribute?: Attribute.Details): Attribute.Milestone[] {
	if (!status || !attribute) return [];
	return attribute.milestones?.filter((x) => x.milestone <= status[attribute.name]!) ?? [];
}

export function getPastEvolutions(status?: Status, attribute?: Attribute.Details): Attribute.Evolution[] {
	if (!status || !attribute) return [];
	return attribute.evolutions?.filter((x) => x.chapter <= status.chapter) ?? [];
}

export function getPastBoosts(chapter: number, attribute?: Attribute.Details): Attribute.Boost[] {
	if (!attribute || !attribute.boosts) return [];
	return attribute.boosts.filter((x) => x.chapter <= chapter) ?? [];
}

export function getCurrentEvolution(status?: Status, attribute?: Attribute.Details): Attribute.Evolution | undefined {
	if (!status || !attribute) return undefined;
	return attribute.evolutions?.findLast((x) => x.chapter <= status.chapter);
}

export function getCurrentBoost(chapter: number, attribute?: Attribute.Details): string {
	const boosts = getPastBoosts(chapter, attribute);
	const total = sum(boosts, (x) => x.boost);
	return total === 0 ? "" : ` (${Math.round(total * 100)}%)`;
}
