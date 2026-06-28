import { formatNumber } from "@/data/helpers";
import type { AttributeAnalysis, AttributeAnalysisRow } from "./types";
import { useSkills, useAttributes, useStatuses, useLatestChapter } from "@/data/api";
import { useMemo } from "react";
import { calculateBaseAttributeValue, getCurrentBoost } from "..";
import { orderBy } from "es-toolkit";

export function formatDiff(diff: number) {
	if (diff === 0) return "--";
	if (diff > 0) return `+${formatNumber(diff)}`;
	return formatNumber(diff);
}
export function getCalculationText(analysis: AttributeAnalysis) {
	const base = formatNumber(analysis.baseValue);
	const boost = Math.round(analysis.titleBoost * 100) + "%";
	return `${base} + ${boost}`;
}

export function useAttributeAnalysis(): AttributeAnalysisRow[] {
	const { data: skills, isLoading: isLoadingSkills } = useSkills();
	const { data: attributes, isLoading: isLoadingAttributes } = useAttributes();
	const { data: statuses, isLoading: isLoadingStatuses } = useStatuses();
	const maxChapter = useLatestChapter();

	return useMemo(() => {
		if (isLoadingAttributes || isLoadingStatuses || isLoadingSkills) {
			return [];
		}
		const data: AttributeAnalysisRow[] = [];
		let previousStatus = statuses[0] as Required<OfficialStatus>;
		let lastOfficialStatus = previousStatus;
		for (let index = 0; index < maxChapter; index++) {
			const chapter = index + 1;
			const status = statuses[index] || {};
			if (status.attributes?.length) {
				lastOfficialStatus = status as Required<OfficialStatus>;
			}
			data.push({
				chapter: chapter,
				note: status?.note ?? "",
				attributes: attributes.map((x) =>
					calculateAttributeAnalysis(previousStatus, lastOfficialStatus, status, chapter, x, skills),
				),
			});
			previousStatus = lastOfficialStatus;
		}

		return orderBy(data, ["chapter"], ["desc"]);
	}, [skills, attributes, statuses]);
}

function calculateAttributeAnalysis(
	previousStatus: Required<OfficialStatus>,
	lastOfficialStatus: Required<OfficialStatus>,
	status: OfficialStatus,
	chapter: number,
	attribute: Attribute.Details,
	skills: Skill[],
): AttributeAnalysis {
	const previousValue = previousStatus.attributes[attribute.index]!;
	const baseValue = calculateBaseAttributeValue(skills, attribute, chapter);
	const boost = getCurrentBoost(chapter, attribute);
	const calculatedValue = Math.round(baseValue * (1 + boost));
	let officialValue = "?";
	if (status.attributes) {
		officialValue = formatNumber(status.attributes[attribute.index] || 0);
	}
	const lastOfficialValue = (status.attributes ?? lastOfficialStatus.attributes)[attribute.index] || 0;

	return {
		previousValue,
		lastOfficialValue: lastOfficialValue,
		officialValue: officialValue,
		baseValue: baseValue,
		titleBoost: boost,
		calculatedValue: calculatedValue,
		diff: calculatedValue - lastOfficialValue,
	};
}
