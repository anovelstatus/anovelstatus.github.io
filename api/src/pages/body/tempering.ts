import { getChapterFilter, parseFormattedTable, parseId, parseRichText, parseTable } from "../shared";

type StageColumns = Omit<Record<keyof TemperingStage, number>, "updates">;
type StepColumns = Record<keyof TemperingStep, number>;

export const getTempering: CacheableFunc<TemperingStage[]> = (ss, ranges, attributes, chapterLimit) => {
	const updates = getSteps(ss, ranges, attributes, chapterLimit);

	const range = ss.getRange(ranges["Body Tempering Stages"]);
	return parseTable(
		range,
		mapStageColumns,
		(row, headers) => mapStage(row, headers, updates),
		(row) => row.updates.length > 0,
	);
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

function mapStage(row: SpreadsheetValue[], headers: StageColumns, updates: TemperingStep[]): TemperingStage {
	const name = row[headers.name];
	return {
		name: name as string,
		tier: row[headers.tier] as string,
		chapter: row[headers.chapter] as number,
		expectedSteps: row[headers.expectedSteps] as number,
		description: row[headers.description] as string,
		updates: updates.filter((x) => x.stage == name),
	};
}

const getSteps: CacheableFunc<TemperingStep[]> = (ss, ranges, _attributes, chapterLimit) => {
	const range = ss.getRange(ranges["Body Tempering Progress"]);
	return parseFormattedTable(
		range,
		mapStepColumns,
		(row, richRow, headers) => mapStep(row, richRow, headers, chapterLimit),
		getChapterFilter(chapterLimit, "started"),
	);
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
