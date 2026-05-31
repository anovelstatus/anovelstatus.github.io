import { getTierRank, toIdString } from "@/data/helpers";
import { Typography } from "@mui/material";
import { sumBy } from "es-toolkit";

export const IDEAL_QUALITY = "Ideal";

export type SkillFiltersOptions = {
	chapter: number;
	showFormerSkills?: boolean;
	providesAttributes: Attribute.Basic[];
	tier?: string;
	idealOnly: boolean;
};

export function showSkill(x: Skill, filters: SkillFiltersOptions) {
	if (filters.tier && x.tier !== filters.tier) return false;

	if (getLevelOnChapter(x, filters.chapter) <= 0 && !filters.showFormerSkills) return false;

	if (!filters.showFormerSkills && x.replaced) return false;

	if (filters.providesAttributes.length) {
		for (const attr of filters.providesAttributes) {
			if (!x[attr.name]) return false;
		}
	}

	if (filters.idealOnly && x.quality !== IDEAL_QUALITY) return false;

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
	return sumBy(
		skill.gains.filter((x) => x.chapter <= chapter),
		(x) => x.count,
	);
}
