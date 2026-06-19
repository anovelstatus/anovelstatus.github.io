export type AttributeAnalysis = {
	baseValue: number;
	titleBoost: number;
	calculatedValue: number;
	officialValue: string;
	lastOfficialValue: number;
	previousValue: number;
	diff: number;
};

export type AttributeAnalysisRow = {
	chapter: number;
	note: string;
	attributes: AttributeAnalysis[];
};
