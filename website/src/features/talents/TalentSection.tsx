import { LoreSection } from "@/components/LoreSection";
import { Stack, Typography, Chip } from "@mui/material";
import TalentTable from "./TalentTable";
import { WrappedRow } from "@/components/WrappedRow";

type TalentSectionProps = {
	chip: string | number;
	type: string;
	talents: Talent[];
};

export function TalentSection({ chip, type, talents }: TalentSectionProps) {
	return (
		<Stack>
			<Typography variant="h5">
				<WrappedRow>
					{type}
					<Chip label={chip} sx={{ fontWeight: "bold" }} />
				</WrappedRow>
			</Typography>
			<LoreSection topic="Talents" subtopic={type} />
			<TalentTable data={talents} />
		</Stack>
	);
}
