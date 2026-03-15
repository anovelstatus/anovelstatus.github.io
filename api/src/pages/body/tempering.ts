import { parseId, parseRichText } from "../shared";

type StageColumns = Omit<Record<keyof TemperingStage, number>, "updates">;
type StepColumns = Omit<Record<keyof TemperingStep, number>, "note2">;

export const getTempering: CacheableFunc<TemperingStage[]> = (ss, ranges, attributes, chapterLimit) => {
	const updates = getSteps(ss, ranges, attributes, chapterLimit);

	const range = ranges["Body Tempering Stages"];
	const data = ss.getRange(range).getValues();
	const headers = mapStageColumns(data[0]!);
	return data
		.slice(1)
		.map((row) => mapStage(row, headers, updates))
		.filter((x) => x.updates.length > 0);
};

function mapStageColumns(headerRow: string[]): StageColumns {
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
	const range = ranges["Body Tempering Progress"];
	const data = ss.getRange(range).getValues();
	const richData = ss.getRange(range).getRichTextValues();

	const headers = mapStepColumns(data[0]!);
	const updates = [];
	for (let i = 1; i < data.length; i++) {
		const row = data[i]!;
		const richRow = richData[i]!;
		const step = mapStep(row, richRow, headers);
		// Remove the finished chapter if it's in the future
		if (step.completed && step.completed > chapterLimit) {
			step.completed = undefined;
		}
		if (step.started <= chapterLimit) {
			updates.push(step);
		}
	}
	return updates;
};

function mapStepColumns(headerRow: string[]): StepColumns {
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

function mapStep(row: SpreadsheetValue[], richRow: RichValue[], headers: StepColumns): TemperingStep {
	const note: RichText[] = parseRichText(richRow[headers.note]);
	return {
		stage: row[headers.stage] as string,
		category: row[headers.category] as string,
		started: row[headers.started] as number,
		completed: row[headers.completed] as number,
		linkType: row[headers.linkType] as string,
		link: row[headers.link] ? parseId(row[headers.link] as string) : undefined,
		note: note,
		note2: note,
	};
}
