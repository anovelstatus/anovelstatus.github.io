export function adjustStatus(
	status: number[] | undefined,
	extras: number[],
	baseBoosts: number[],
	extraBoosts: number[],
) {
	if (!status) return undefined;
	const adjusted: number[] = [];
	for (let index = 0; index < status.length; index++) {
		const currentTotal = status[index]!;
		const extra = (extras[index] || 0) / 100;
		const multiplier = 1 + baseBoosts[index]! + (extraBoosts[index] || 0);
		adjusted[index] = Math.round(currentTotal + extra * multiplier);
	}
	return adjusted;
}
