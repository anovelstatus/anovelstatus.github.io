import { formatNumber } from "@/data/helpers";
import { Stack, Tooltip } from "@mui/material";
import type { AttributeAnalysis } from "./types";
import { getClass } from "./styles";
import { CalculationText } from "./CalculationText";

type AnalysisRowProps = {
	analysis: AttributeAnalysis;
	attribute: Attribute.Details;
};

export function AnalysisRow({ attribute, analysis }: AnalysisRowProps) {
	const diff = analysis.calculatedValue - analysis.lastOfficialValue;
	const diffDisplay = diff === 0 ? "--" : diff > 0 ? `+${formatNumber(diff)}` : formatNumber(diff);

	return (
		<Stack direction="row" className={getClass(analysis)} sx={{ padding: 1 }}>
			<span>{attribute.abbreviation}:</span>
			<span>{analysis.officialValue} |</span>
			<span>{diffDisplay} |</span>
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
