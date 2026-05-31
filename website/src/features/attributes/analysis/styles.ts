import type { SxProps, Theme } from "@mui/material";
import type { AttributeAnalysis } from "./types";

export const styles: SxProps<Theme> = {
	".ch-note": {
		backgroundColor: "#582b00",
	},
	".error": {
		backgroundColor: "#af0000 !important",
	},
	".higher": {
		backgroundColor: "#b46c00 !important",
	},
	".lower": {
		backgroundColor: "#003b99 !important",
	},
};

export function getClass(analysis: AttributeAnalysis) {
	if (analysis.lastOfficialValue < analysis.previousValue) return "error";
	const diff = analysis.calculatedValue - analysis.lastOfficialValue;
	return diff > 0.5 ? "higher" : diff < -0.5 ? "lower" : "";
}
