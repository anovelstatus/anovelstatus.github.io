export function adjustStatus(baseValues: number[], extraValues: number[], baseBoosts: number[], extraBoosts: number[]) {
	const adjusted: number[] = [];
	for (let index = 0; index < baseValues.length; index++) {
		const base = baseValues[index]!;
		const extra = extraValues[index] || 0;
		const multiplier = 1 + baseBoosts[index]! + (extraBoosts[index] || 0) / 100;
		adjusted[index] = Math.round((base + extra) * multiplier);
	}
	return adjusted;
}
