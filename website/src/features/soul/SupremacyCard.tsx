import { LoreSection } from "@/components/LoreSection";
import { Card, CardHeader, CardContent } from "@mui/material";

type SupremacyCardProps = {
	name: string;
	stages: SupremacyStage[] | undefined;
};

export function SupremacyCard({ name }: SupremacyCardProps) {
	return (
		<Card>
			<CardHeader title={name} />
			<CardContent>
				<LoreSection topic={name} />
			</CardContent>
			<CardContent>🚧 Under Construction</CardContent>
		</Card>
	);
}
