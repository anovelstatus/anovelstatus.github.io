import { formatNumber } from "@/data/helpers";
import type { AttributeAnalysis } from "./types";

export function CalculationText({ analysis }: { analysis: AttributeAnalysis }) {
	const base = formatNumber(analysis.baseValue);
	const boost = Math.round(analysis.titleBoost * 100) + "%";
	return `${base} + ${boost}`;
}
