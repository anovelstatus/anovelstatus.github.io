import { Card, CardContent, CardHeader, Chip, Stack, Typography } from "@mui/material";
import { sumBy } from "es-toolkit";
import { WrappedRow } from "@/components/WrappedRow";

type ThresholdCardProps = {
	thresholds: TribulationThreshold[];
	title: string;
};

export function ThresholdCard({ thresholds, title }: ThresholdCardProps) {
	const totalCount = sumBy(thresholds, (x) => x.counts.length);
	return (
		<Card>
			<CardHeader
				title={
					<WrappedRow>
						{title}
						<Chip size="small" label={totalCount} />{" "}
					</WrappedRow>
				}
			/>
			<CardContent>
				<Stack spacing={1}>
					{thresholds.map((x) => (
						<Typography key={"threshold-" + x.threshold}>
							{x.counts.join(", ")} attributes above {x.threshold}
						</Typography>
					))}
				</Stack>
			</CardContent>
		</Card>
	);
}
