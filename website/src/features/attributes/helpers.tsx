import { useAttributes, useSkills } from "@/data/api";
import { toIdString } from "@/data/helpers";
import { Box } from "@mui/material";
import { useMemo } from "react";
import { SkillButton } from "@/features/skills";
import { TitleButton } from "@/features/titles";
import { hasNote, RichTextSpan } from "@/components/RichTextSpan";
import { maxBy, orderBy, sumBy } from "es-toolkit";
import { getLevelOnChapter } from "@/features/skills/helpers";

/** Find the latest status for a given chapter or earlier */
export function getLatestStatus(statuses: OfficialStatus[], chapter: number): FoundStatus | undefined {
	for (let i = Math.min(chapter, statuses.length - 1); i >= 0; i--) {
		const status = statuses[i]!;
		if (status.attributes) {
			return { chapter: i + 1, attributes: status.attributes };
		}
	}
	return undefined;
}

export function getEvolvedName(attribute: Attribute.Details, chapter: number): string {
	const evolution = getCurrentEvolution(chapter, attribute);
	if (!evolution?.name) return attribute.name;
	const suffix = evolution.name
		.split("-")
		.map((x) => x.trim()[0])
		.join("");
	return `${attribute.name} (${suffix})`;
}

export function getPastMilestones(status?: number[], attribute?: Attribute.Details): Attribute.Milestone[] {
	if (!status || !attribute) return [];
	return attribute.milestones?.filter((x) => x.milestone <= status[attribute.index]!) ?? [];
}

export function getPastBoosts(chapter: number, attribute?: Attribute.Details): Attribute.Boost[] {
	if (!attribute || !attribute.boosts) return [];
	return attribute.boosts.filter((x) => x.chapter <= chapter) ?? [];
}

export function getCurrentEvolution(chapter: number, attribute?: Attribute.Details): Attribute.Evolution | undefined {
	if (!chapter || !attribute) return undefined;
	const pastEvolutions = attribute.evolutions?.filter((x) => x.chapter <= chapter) ?? [];
	return maxBy(pastEvolutions, (x) => x.chapter);
}

export function getCurrentBoost(chapter: number, attribute?: Attribute.Details): number {
	const boosts = getPastBoosts(chapter, attribute);
	const total = sumBy(boosts, (x) => x.boost);
	return Math.round(total * 100) / 100;
}

export function useCalculatedStatus(chapter: number): number[] | undefined {
	const { data: skills, isLoading: skillsLoading } = useSkills();
	const { data: attributes, isLoading: attributesLoading } = useAttributes();
	return useMemo(() => {
		if (skillsLoading || attributesLoading) return undefined;
		return calculateStatus(chapter, skills, attributes);
	}, [chapter, skills, attributes]);
}

function calculateStatus(chapter: number, skills: Skill[], attributes: Attribute.Details[]): number[] | undefined {
	const status: number[] = [];

	for (const attribute of attributes) {
		const baseValue = calculateBaseAttributeValue(skills, attribute, chapter);
		const boost = getCurrentBoost(chapter, attribute);
		status[attribute.index] = Math.round(baseValue * (1 + boost));
	}
	return status;
}

export function calculateBaseAttributeValue(skills: Skill[], attribute: Attribute.Details, chapter: number) {
	const attributeSkills = skills.filter((skill) => skill.attributes[attribute.index]! > 0);
	let baseValue = sumBy(
		attribute.gains.filter((x) => x.chapter <= chapter),
		(x) => x.gain,
	);
	for (const skill of attributeSkills) {
		baseValue += getLevelOnChapter(skill, chapter) * skill.attributes[attribute.index]!;
	}
	return baseValue;
}

export function useChapterGains(chapter: number): React.ReactNode[] {
	const { data: skills } = useSkills();
	const { data: attributes } = useAttributes();
	const notes: React.ReactNode[] = [];

	for (const attribute of attributes || []) {
		attribute.boosts
			.filter((x) => x.chapter === chapter)
			.forEach((boost) => {
				const suffix = hasNote(boost.note) ? (
					<>
						{" ("}
						<RichTextSpan data={boost.note} />
						{")"}
					</>
				) : (
					""
				);
				notes.push(
					<Box key={`${attribute.name}-boost-${toIdString(boost.title)}`}>
						{boost.boost > 0 ? "+" : ""}
						{`${Math.round(boost.boost * 100)}% ${attribute.name} from `}
						<TitleButton item={boost.title} />
						{suffix}
					</Box>,
				);
			});
	}
	for (const skill of skills || []) {
		const skillLevels = skill.gains.filter((x) => x.chapter === chapter);
		if (skillLevels.length > 0) {
			const skillAttributes = attributes
				.filter((x) => skill.attributes[x.index])
				.map((x) => `${skill.attributes[x.index]! * sumBy(skillLevels, (x) => x.count)} ${x.abbreviation}`);
			if (skillAttributes.length === 0) continue;
			notes.push(
				<Box key={`${skill.name}-levels`}>
					{`${skillAttributes.join(", ")} from ${sumBy(skillLevels, (x) => x.count)} levels in `}
					<SkillButton item={skill} />
				</Box>,
			);
		}
	}

	for (const attribute of attributes || []) {
		const gains = attribute.gains.filter((x) => x.chapter === chapter && x.gain !== 0);
		for (const gain of gains) {
			notes.push(
				<Box key={`${attribute.name}-gain`}>
					{`${gain.gain} ${attribute.abbreviation} from `}
					<RichTextSpan data={gain.note} />
				</Box>,
			);
		}
	}
	return notes;
}

export function useTribulationThresholds(status: number[] | undefined, race: Race | undefined): TribulationThreshold[] {
	if (!status || !race) return [];

	// Assuming thresholds of 100 * race tier, when 1/3/6/12 attributes cross that threshold
	const relevantCounts = [1, 3, 6, 12];
	const stats = status;
	const max = maxBy(stats, (x) => x) ?? 0;
	const tier = 100 * (race.tier + 1);
	const data: Record<number, number[]> = {};
	for (let i = tier; i <= max; i += tier) {
		const count = stats.filter((x) => x >= i).length;
		for (const relevantCount of relevantCounts) {
			if (count >= relevantCount) {
				if (!data[i]) data[i] = [];
				data[i]!.push(relevantCount);
			}
		}
	}

	return orderBy(
		Object.entries(data).map((x) => ({ threshold: parseInt(x[0]), counts: x[1] })),
		[(x) => x.threshold],
		["asc"],
	);
}
