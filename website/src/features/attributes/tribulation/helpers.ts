export function adjustStatus(
	status: number[] | undefined,
	attributes: Attribute.Details[],
	changes: number[],
	allBoosts: number[],
) {
	if (!status || !attributes.length) return undefined;
	const adjusted: number[] = [];
	for (const { index } of attributes) {
		adjusted[index] = Math.round(status[index]! + (changes[index] || 0) * (1 + allBoosts[index]!));
	}
	return adjusted;
}
