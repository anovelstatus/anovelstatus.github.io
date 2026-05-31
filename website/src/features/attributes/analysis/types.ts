export type AttributeAnalysis = {
	baseValue: number;
	titleBoost: number;
	calculatedValue: number;
	officialValue: string;
	lastOfficialValue: number;
	previousValue: number;
};

export type AttributeAnalysisRow = {
	chapter: number;
	note: string;
	attributes: Record<string, AttributeAnalysis>;
};
