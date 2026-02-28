import { getCurrentLevel, getTierRank, toIdString } from "@/data/helpers";
import { Typography } from "@mui/material";

export const IDEAL_QUALITY = "Ideal";

export type SkillFiltersOptions = {
	chapter: number;
	showFormerSkills?: boolean;
	providesAttributes: Attribute.Details[];
	tier?: string;
	idealOnly: boolean;
};

export function showSkill(x: Skill, filters: SkillFiltersOptions) {
	if (filters.tier && x.tier !== filters.tier) return false;

	if (getCurrentLevel(x, filters.chapter) <= 0) return false;

	if (!filters.showFormerSkills && x.replaced) return false;

	if (filters.providesAttributes.length) {
		for (const attr of filters.providesAttributes) {
			if (!x[attr.name]) return false;
		}
	}

	if (filters.idealOnly && x.quality !== IDEAL_QUALITY) return false;

	return true;
}

export function getPrerequisiteList(skill: Skill) {
	const keyPrefix = toIdString(skill) + "-prerequisite";
	const list = skill.prerequisites
		.split("\n")
		.map((x) => x.trim())
		.filter((x) => x.length > 0);

	if (list.length === 0) return [];

	if (list.length < 6) {
		return list.map((x) => (
			<Typography variant="body2" key={x}>
				{x}
			</Typography>
		));
	}

	const selected = list.slice(0, 5);
	const extra = list.slice(5);

	return [
		<Typography variant="h6" key={`${keyPrefix}-selected`}>
			Selected
		</Typography>,
		...selected.map((x, index) => (
			<Typography variant="body2" key={`${keyPrefix}-${index}`}>
				{x}
			</Typography>
		)),
		<Typography variant="h6" key={`${keyPrefix}-more`}>
			and {list.length - 5} more...
		</Typography>,
		...extra.map((x, index) => (
			<Typography variant="body2" key={`${keyPrefix}-${index + 5}`}>
				{x}
			</Typography>
		)),
	];
}

export function getMaxLevel(skill: Skill, skillTiers: string[]): number {
	return (getTierRank(skillTiers, skill.tier) + 1) * 20;
}

export function getProgressGradient(percent: number, hexColor: string): string {
	const transparent = hexColor + "00";
	return `linear-gradient(90deg, ${hexColor} 0%, ${hexColor} ${percent}%, ${transparent} ${percent}%, ${transparent} 100%)`;
}
