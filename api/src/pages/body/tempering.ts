import { getChapterFilter, parseFormattedTable, parseId, parseRichText } from "../shared";

type StageColumns = Omit<Record<keyof TemperingStage, number>, "updates">;
type StepColumns = Record<keyof TemperingStep, number>;

export const getTempering: StandardParser<TemperingStage[]> = (info) => {
	const updates = getSteps(info);

	const range = info.ss.getRange(info.ranges["Body Tempering Stages"]);
	return parseFormattedTable(range, mapStageColumns, mapStage, (row) => row.updates.length > 0, updates);
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
	const name = row[headers.name];
	return {
		name: name as string,
		tier: row[headers.tier] as string,
		chapter: row[headers.chapter] as number,
		expectedSteps: row[headers.expectedSteps] as number,
		description: parseRichText(richRow[headers.description]!),
		updates: updates.filter((x) => x.stage == name),
	};
}

const getSteps: StandardParser<TemperingStep[]> = ({ ss, ranges, chapterLimit }) => {
	const range = ss.getRange(ranges["Body Tempering Progress"]);
	return parseFormattedTable(range, mapStepColumns, mapStep, getChapterFilter(chapterLimit, "started"), chapterLimit);
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
	const note: RichText[] = parseRichText(richRow[headers.note]);

	// If the step is completed in the future, treat it as not completed
	let completed = row[headers.completed] as number | undefined;
	if (completed && completed > chapterLimit) completed = undefined;

	return {
		stage: row[headers.stage] as string,
		category: row[headers.category] as string,
		started: row[headers.started] as number,
		completed: completed,
		linkType: row[headers.linkType] as string,
		link: row[headers.link] ? parseId(row[headers.link] as string) : undefined,
		note: note,
	};
}
