import { Card, CardContent, CardHeader, Grid, Stack, Typography } from "@mui/material";
import type { AttributeAnalysisRow } from "./types";
import { ChaptersChip } from "@/components/chips";
import { useAttributes } from "@/data/api";
import { AnalysisRow } from "./AnalysisRow";

type AnalysisCardProps = {
	data: AttributeAnalysisRow;
};

export function AnalysisCard({ data }: AnalysisCardProps) {
	const { data: attributes } = useAttributes();

	return (
		<Card>
			<CardHeader
				title={
					<Grid container spacing={1} sx={{ alignItems: "center" }}>
						<ChaptersChip chapters={data.chapter} />
						<span>Analysis</span>
					</Grid>
				}
			/>
			<CardContent>
				<Stack>
					{data.note && <Typography variant="body2">{data.note}</Typography>}
					<Stack spacing={0}>
						{attributes.map((x) => (
							<AnalysisRow key={x.name} attribute={x} analysis={data.attributes[x.name]!} />
						))}
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}
