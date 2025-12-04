import { useAttributes, useSkills } from "@/data/api";
import { getCurrentLevel, sum } from "@/data/helpers";
import { Typography } from "@mui/material";
import { useMemo } from "react";
import { SkillButton } from "../skills";
import { TitleButton } from "../titles";

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

export function getCurrentBoost(chapter: number, attribute?: Attribute.Details): number {
	const boosts = getPastBoosts(chapter, attribute);
	const total = sum(boosts, (x) => x.boost);
	return Math.round(total * 100) / 100;
}

export function useCalculatedStatus(chapter: number): Status | undefined {
	const { data: skills } = useSkills();
	const { data: attributes } = useAttributes();
	if (!skills || !attributes) return undefined;

	return useMemo(() => calculateStatus(chapter, skills, attributes), [chapter, skills, attributes]);
}

export function calculateStatus(chapter: number, skills: Skill[], attributes: Attribute.Details[]): Status | undefined {
	const status: Status = { chapter: chapter };

	for (const attribute of attributes) {
		const attributeSkills = skills.filter((skill) => skill[attribute.name] && skill[attribute.name]! > 0);
		let baseValue = sum(
			attribute.gains.filter((x) => x.chapter <= chapter),
			(x) => x.gain,
		);
		for (const skill of attributeSkills) {
			baseValue += getCurrentLevel(skill, chapter) * skill[attribute.name]!;
		}

		const boost = getCurrentBoost(chapter, attribute);
		status[attribute.name] = Math.round(baseValue * (1 + boost));
	}
	return status;
}

export function getChapterGains(chapter: number): React.ReactNode[] {
	const { data: skills } = useSkills();
	const { data: attributes } = useAttributes();
	const notes: React.ReactNode[] = [];

	for (const attribute of attributes || []) {
		attribute.boosts
			.filter((x) => x.chapter === chapter)
			.forEach((boost) => {
				const suffix = boost.note ? ` (${boost.note})` : "";
				notes.push(
					<Typography component="div" key={`${attribute.name}-boost-${boost.title}`}>
						{boost.boost > 0 ? "+" : ""}
						{`${Math.round(boost.boost * 100)}% ${attribute.name} from `}
						<TitleButton title={boost.titleId} />
						{suffix}
					</Typography>,
				);
			});
	}
	for (const skill of skills || []) {
		const skillLevels = skill.gains.find((x) => x.chapter === chapter);
		if (skillLevels) {
			const skillAttributes = attributes
				.filter((x) => skill[x.name])
				.map((x) => `${skill[x.name]! * skillLevels.count} ${x.abbreviation}`);
			if (skillAttributes.length === 0) continue;
			notes.push(
				<Typography component="div" key={`${skill.name}-levels`}>
					{`${skillAttributes.join(", ")} from ${skillLevels.count} levels in `}
					<SkillButton skill={skill} />
				</Typography>,
			);
		}
	}
	return notes;
}
