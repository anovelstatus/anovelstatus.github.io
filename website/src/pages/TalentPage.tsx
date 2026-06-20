import { useTalentGroups, TalentSection } from "@/features/talents";
import { useChapter } from "@/data/api";
import { Stack, Typography, Chip } from "@mui/material";
import { sumBy } from "es-toolkit";
import { LoreSection } from "@/components/LoreSection";
import { useRaceOnChapter } from "@/features/body/helpers";

const GENERAL_TYPE = "General";
const RACIAL_SLOT_TYPE = "Racial Slot";

export function TalentPage() {
	const chapter = useChapter();
	const currentRace = useRaceOnChapter(chapter);

	const grouped = useTalentGroups();

	const generalTalents = grouped[GENERAL_TYPE] ?? [];
	const freeTalents = grouped[RACIAL_SLOT_TYPE] ?? [];

	const total = sumBy(Object.values(grouped), (x) => x.length);

	const otherTypes = Object.keys(grouped)
		.filter((x) => x != GENERAL_TYPE && x != RACIAL_SLOT_TYPE)
		.toSorted();

	return (
		<Stack spacing={3}>
			<Typography variant="h4" gutterBottom>
				Priam's Talents <Chip label={total} sx={{ fontWeight: "bold" }} />
			</Typography>
			<LoreSection topic="Talents" />
			<TalentSection
				chip={`${freeTalents.length}/${currentRace?.freeSlots} slots used`}
				type="Free Racial Slots"
				talents={freeTalents}
			/>
			{otherTypes.map((type) => (
				<TalentSection
					key={type}
					chip={grouped[type]!.length}
					type={type || "Uncategorized"}
					talents={grouped[type]!}
				/>
			))}
			<TalentSection chip={generalTalents.length} type={GENERAL_TYPE} talents={generalTalents} />
		</Stack>
	);
}
