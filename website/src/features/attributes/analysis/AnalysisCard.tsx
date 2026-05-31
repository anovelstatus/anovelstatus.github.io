import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import type { AttributeAnalysisRow } from "./types";
import { useAttributes } from "@/data/api";
import { AnalysisRow } from "./AnalysisRow";

type AnalysisCardProps = {
	data: AttributeAnalysisRow;
};

export function AnalysisCard({ data }: AnalysisCardProps) {
	const { data: attributes } = useAttributes();

	return (
		<Card>
			<CardHeader title={<span>Chapter {data.chapter}</span>} subheader={data.note} />
			<CardContent sx={{ paddingTop: 0 }}>
				<Stack spacing={0}>
					{attributes.map((x) => (
						<AnalysisRow key={x.name} attribute={x} analysis={data.attributes[x.name]!} />
					))}
				</Stack>
			</CardContent>
		</Card>
	);
}
