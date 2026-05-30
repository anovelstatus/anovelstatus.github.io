import {
	chapterFilter,
	getNumberIfLessThanLimit,
	hasEntriesFilter,
	parseFormattedTable,
	parseNumber,
	parseOptionalId,
	parseRichText,
	parseString,
} from "../shared";

type StageColumns = Omit<Record<keyof TemperingStage, number>, "updates">;
type StepColumns = Record<keyof TemperingStep, number>;

export const getTempering: StandardParser<TemperingStage[]> = (info) => {
	const updates = getSteps(info);
	const range = info.ss.getRange(info.ranges["Body Tempering Stages"]);
	return parseFormattedTable(range, mapStageColumns, mapStage, hasEntriesFilter("updates"), updates);
};

function mapStageColumns(headerRow: SpreadsheetValue[]): StageColumns {
	return {
		name: headerRow.indexOf("Stage"),
		tier: headerRow.indexOf("Quality"),
		chapter: headerRow.indexOf("Revealed"),
		expectedSteps: headerRow.indexOf("Steps"),
		description: headerRow.indexOf("Description"),
	};
}

function mapStage(
	row: SpreadsheetValue[],
	richRow: RichValue[],
	headers: StageColumns,
	updates: TemperingStep[],
): TemperingStage {
	const name = parseString(row[headers.name]);
	return {
		name: name,
		tier: parseString(row[headers.tier]),
		chapter: parseNumber(row[headers.chapter]),
		expectedSteps: parseNumber(row[headers.expectedSteps]),
		description: parseRichText(richRow[headers.description]!),
		updates: updates.filter((x) => x.stage == name),
	};
}

const getSteps: StandardParser<TemperingStep[]> = ({ ss, ranges, chapterLimit }) => {
	const range = ss.getRange(ranges["Body Tempering Progress"]);
	return parseFormattedTable(range, mapStepColumns, mapStep, chapterFilter(chapterLimit, "started"), chapterLimit);
};

function mapStepColumns(headerRow: SpreadsheetValue[]): StepColumns {
	return {
		stage: headerRow.indexOf("Stage"),
		category: headerRow.indexOf("Step"),
		started: headerRow.indexOf("Started"),
		completed: headerRow.indexOf("Finished"),
		linkType: headerRow.indexOf("Link Type"),
		link: headerRow.indexOf("Link"),
		note: headerRow.indexOf("Update"),
	};
}

function mapStep(
	row: SpreadsheetValue[],
	richRow: RichValue[],
	headers: StepColumns,
	chapterLimit: number,
): TemperingStep {
	return {
		stage: parseString(row[headers.stage]),
		category: parseString(row[headers.category]),
		started: parseNumber(row[headers.started]),
		// If the step is completed in the future, treat it as not completed
		completed: getNumberIfLessThanLimit(row[headers.completed], chapterLimit),
		linkType: parseString(row[headers.linkType]),
		link: parseOptionalId(row[headers.link]),
		note: parseRichText(richRow[headers.note]),
	};
}
