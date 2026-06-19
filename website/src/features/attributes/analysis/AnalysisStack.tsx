import { formatNumber } from "@/data/helpers";
import { Stack, Tooltip } from "@mui/material";
import type { AttributeAnalysis } from "./types";
import { formatDiff, getCalculationText } from "./helpers";

type AnalysisStackProps = {
	analysis: AttributeAnalysis;
};

export function AnalysisStack({ analysis }: AnalysisStackProps) {
	const diffDisplay = formatDiff(analysis.diff);

	return (
		<Stack direction="column" sx={{ textAlign: "center" }}>
			<span>{analysis.officialValue}</span>
			<span>{diffDisplay}</span>
			<Tooltip
				title={getCalculationText(analysis)}
				arrow
				slotProps={{
					popper: { modifiers: [{ name: "offset", options: { offset: [0, -14] } }] },
				}}
			>
				<span>{formatNumber(analysis.calculatedValue)}</span>
			</Tooltip>
		</Stack>
	);
}
