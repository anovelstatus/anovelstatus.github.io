import { formatNumber } from "@/data/helpers";
import { Stack, Tooltip } from "@mui/material";
import type { AttributeAnalysis } from "./types";
import { CalculationText } from "./CalculationText";

type AnalysisStackProps = {
	analysis: AttributeAnalysis;
};

export function AnalysisStack({ analysis }: AnalysisStackProps) {
	const diff = analysis.calculatedValue - analysis.lastOfficialValue;
	const diffDisplay = diff === 0 ? "--" : diff > 0 ? `+${formatNumber(diff)}` : formatNumber(diff);

	return (
		<Stack direction="column" sx={{ textAlign: "center" }}>
			<span>{analysis.officialValue}</span>
			<span>{diffDisplay}</span>
			<Tooltip
				title={<CalculationText analysis={analysis} />}
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
