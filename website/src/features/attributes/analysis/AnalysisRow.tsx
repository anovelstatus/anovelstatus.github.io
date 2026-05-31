import { formatNumber } from "@/data/helpers";
import { Box, Tooltip } from "@mui/material";
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
		<Box className={getClass(analysis)} sx={{ padding: 1 }}>
			<span>
				{attribute.abbreviation}: {analysis.officialValue} vs&nbsp;
			</span>
			<Tooltip
				title={<CalculationText analysis={analysis} />}
				arrow
				slotProps={{
					popper: { modifiers: [{ name: "offset", options: { offset: [0, -14] } }] },
				}}
			>
				<span>
					{formatNumber(analysis.calculatedValue)} ({diffDisplay})
				</span>
			</Tooltip>
		</Box>
	);
}
