import { formatNumber } from "@/data/helpers";
import { Tooltip, Typography } from "@mui/material";
import type { AttributeAnalysis } from "./types";
import { getClass } from "./styles";
import { formatDiff, getCalculationText } from "./helpers";

type AnalysisRowProps = {
	analysis: AttributeAnalysis;
	attribute: Attribute.Details;
};

export function AnalysisRow({ attribute, analysis }: AnalysisRowProps) {
	const diffDisplay = formatDiff(analysis.diff);

	return (
		<Typography variant="body2" className={getClass(analysis)} sx={{ padding: "4px" }}>
			<span>
				{attribute.abbreviation}: {analysis.officialValue} vs&nbsp;
			</span>
			<Tooltip
				title={getCalculationText(analysis)}
				arrow
				slotProps={{
					popper: { modifiers: [{ name: "offset", options: { offset: [0, -14] } }] },
				}}
			>
				<span>
					{formatNumber(analysis.calculatedValue)} ({diffDisplay})
				</span>
			</Tooltip>
		</Typography>
	);
}
