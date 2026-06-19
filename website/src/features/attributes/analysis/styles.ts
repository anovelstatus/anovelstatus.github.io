import type { SxProps, Theme } from "@mui/material";
import type { AttributeAnalysis } from "./types";

export const styles: SxProps<Theme> = {
	".ch-note": {
		backgroundColor: "#582b00",
	},
	".error": {
		backgroundColor: "#810000 !important",
	},
	".higher": {
		backgroundColor: "#8a5300 !important",
	},
	".lower": {
		backgroundColor: "#002e79 !important",
	},
};

export function getClass(analysis: AttributeAnalysis) {
	if (analysis.lastOfficialValue < analysis.previousValue) return "error";
	const diff = analysis.calculatedValue - analysis.lastOfficialValue;
	return diff > 0.5 ? "higher" : diff < -0.5 ? "lower" : "";
}
