import { LoreSection } from "@/components/LoreSection";
import { Stack, Typography, Chip } from "@mui/material";
import TalentTable from "./TalentTable";

type TalentSectionProps = {
	chip: string | number;
	type: string;
	talents: Talent[];
};

export function TalentSection({ chip, type, talents }: TalentSectionProps) {
	return (
		<Stack>
			<Typography variant="h5">
				<Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center" }}>
					{type}
					<Chip label={chip} sx={{ fontWeight: "bold" }} />
				</Stack>
			</Typography>
			<LoreSection topic="Talents" subtopic={type} />
			<TalentTable data={talents} />
		</Stack>
	);
}
