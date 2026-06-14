import { useAttributes, useLatestChapter, useSkills, useStatusDictionary } from "@/data/api";
import { formatNumber, toIdString } from "@/data/helpers";
import { Box } from "@mui/material";
import { useMemo } from "react";
import { SkillButton } from "@/features/skills";
import { TitleButton } from "@/features/titles";
import { hasNote, RichTextSpan } from "@/components/RichTextSpan";
import { sumBy } from "es-toolkit";
import { getLevelOnChapter } from "@/features/skills/helpers";
import type { AttributeAnalysisRow, AttributeAnalysis } from "./analysis/types";

export function getEvolvedName(attribute: Attribute.Details, status: Status): string {
	const evolution = getCurrentEvolution(status, attribute);
	const suffix = evolution?.name ? ` (${evolution.name[0]})` : "";
	return attribute.name + suffix;
}

export function getPastMilestones(status?: Status, attribute?: Attribute.Details): Attribute.Milestone[] {
	if (!status || !attribute) return [];
	return attribute.milestones?.filter((x) => x.milestone <= status.attributes[attribute.index]!) ?? [];
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
	const total = sumBy(boosts, (x) => x.boost);
	return Math.round(total * 100) / 100;
}

export function useCalculatedStatus(chapter: number): Status | undefined {
	const skills = useSkills();
	const attributes = useAttributes();
	return useMemo(() => {
		if (skills.isFetching || attributes.isFetching) return undefined;
		return calculateStatus(chapter, skills.data, attributes.data);
	}, [chapter, skills, attributes]);
}

export function calculateStatus(chapter: number, skills: Skill[], attributes: Attribute.Details[]): Status | undefined {
	const status: Status = { chapter: chapter, attributes: [] };

	for (const attribute of attributes) {
		const baseValue = calculateBaseAttributeValue(skills, attribute, chapter);
		const boost = getCurrentBoost(chapter, attribute);
		status.attributes[attribute.index] = Math.round(baseValue * (1 + boost));
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

export function useAttributeAnalysis(): AttributeAnalysisRow[] {
	const maxChapter = useLatestChapter();
	const { data: skills } = useSkills();
	const { data: attributes } = useAttributes();
	const statuses = useStatusDictionary();

	if (!attributes.length || !statuses[1]) {
		return [];
	}

	return useMemo(() => {
		const data: AttributeAnalysisRow[] = [];
		let previousStatus = statuses[1]!;
		let lastOfficialStatus = statuses[1]!;
		for (let chapter = 1; chapter <= maxChapter; chapter++) {
			const status = statuses[chapter];
			if (status) {
				lastOfficialStatus = status;
			}

			const row: AttributeAnalysisRow = {
				chapter: chapter,
				note: status?.note ?? "",
				attributes: {},
			};

			for (const attribute of attributes) {
				row.attributes[attribute.name] = calculateAttributeAnalysis(
					previousStatus,
					lastOfficialStatus,
					status,
					chapter,
					attribute,
					skills,
				);
			}
			data.push(row);
			previousStatus = lastOfficialStatus;
		}

		return data;
	}, [maxChapter, skills, attributes, statuses]);
}

function calculateAttributeAnalysis(
	previousStatus: Status,
	lastOfficialStatus: Status,
	status: Status | undefined,
	chapter: number,
	attribute: Attribute.Details,
	skills: Skill[],
): AttributeAnalysis {
	const previousValue = previousStatus.attributes[attribute.index]!;
	const baseValue = calculateBaseAttributeValue(skills, attribute, chapter);
	const boost = getCurrentBoost(chapter, attribute);
	const calculatedValue = Math.round(baseValue * (1 + boost));
	let officialValue = "?";
	if (status) {
		officialValue = formatNumber(status.attributes[attribute.index] || 0);
	}
	const lastOfficialValue = (status ?? lastOfficialStatus).attributes[attribute.index] || 0;

	return {
		previousValue,
		lastOfficialValue: lastOfficialValue,
		officialValue: officialValue,
		baseValue: baseValue,
		titleBoost: boost,
		calculatedValue: calculatedValue,
	};
}
