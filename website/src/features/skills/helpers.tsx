import { getTierRank } from "@/data/helpers";
import { sumBy } from "es-toolkit";

export const IDEAL_QUALITY = "Ideal";

export type SkillFiltersOptions = {
	chapter: number;
	showFormerSkills?: boolean;
	providesAttributes: Attribute.Details[];
	tier?: string;
	idealOnly: boolean;
	tags: string[];
};

export function showSkill(skill: Skill, filters: SkillFiltersOptions) {
	if (filters.tier && skill.tier !== filters.tier) return false;

	// If a skill has replaced it, hide
	if (!filters.showFormerSkills && skill.chReplaced && skill.chReplaced <= filters.chapter) return false;
	// If it has no levels yet, hide
	if (!skill.gains.some((gain) => gain.chapter <= filters.chapter)) return false;

	if (filters.providesAttributes.length) {
		for (const { index } of filters.providesAttributes) {
			if (!skill.attributes[index]) return false;
		}
	}

	if (filters.idealOnly && skill.quality !== IDEAL_QUALITY) return false;

	if (filters.tags.length && !filters.tags.every((tag) => skill.tags?.includes(tag))) return false;

	return true;
}

export function getMaxLevel(skill: Skill, skillTiers: string[]): number {
	return (getTierRank(skillTiers, skill.tier) + 1) * 20;
}

export function getProgressGradient(percent: number, hexColor: string): string {
	const transparent = hexColor + "00";
	return `linear-gradient(90deg, ${hexColor} 0%, ${hexColor} ${percent}%, ${transparent} ${percent}%, ${transparent} 100%)`;
}

export function getLevelOnChapter(skill: Skill, chapter: number) {
	return (
		sumBy(
			skill.gains.filter((x) => x.chapter <= chapter),
			(x) => x.count,
		) + (skill.adjustment || 0)
	);
}
