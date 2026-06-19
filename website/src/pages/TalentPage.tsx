import { TalentTable, useTalentGroups } from "@/features/talents";
import { useChapter } from "@/data/api";
import { Stack, Typography, Chip } from "@mui/material";
import { sumBy } from "es-toolkit";
import { LoreSection } from "@/components/LoreSection";
import { Fragment } from "react/jsx-runtime";
import { useRaceOnChapter } from "@/features/body/helpers";

export function TalentPage() {
	const chapter = useChapter();
	const currentRace = useRaceOnChapter(chapter);

	const grouped = useTalentGroups();

	const generalTalents = grouped["General"] ?? [];
	const freeTalents = grouped["Racial Slot"] ?? [];

	const total = sumBy(Object.values(grouped), (x) => x.length);

	const otherTypes = Object.keys(grouped)
		.filter((x) => x != "General" && x != "Racial Slot")
		.toSorted();

	return (
		<Stack spacing={2}>
			<Typography variant="h4" gutterBottom>
				Priam's Talents <Chip label={total} sx={{ fontWeight: "bold" }} />
			</Typography>
			<LoreSection topic="Talents" />
			<Typography variant="h5" gutterBottom>
				Free Racial Slots{" "}
				{currentRace && (
					<Chip label={`${freeTalents.length}/${currentRace?.freeSlots} slots used`} sx={{ fontWeight: "bold" }} />
				)}
			</Typography>
			<LoreSection topic="Talents" subtopic="Free Racial Slots" />
			<TalentTable data={freeTalents} />
			{otherTypes.map((type) => (
				<Fragment key={"talent-group-" + type}>
					<Typography variant="h5" gutterBottom>
						{type || "Uncategorized"} Talent{grouped[type]!.length !== 1 ? "s" : ""}{" "}
						<Chip label={grouped[type]!.length} sx={{ fontWeight: "bold" }} />
					</Typography>

					<LoreSection topic="Talents" subtopic={type} />
					<TalentTable data={grouped[type]!} />
				</Fragment>
			))}
			<Typography variant="h5" gutterBottom>
				General Talent{generalTalents.length !== 1 ? "s" : ""}{" "}
				<Chip label={generalTalents.length} sx={{ fontWeight: "bold" }} />
			</Typography>
			<LoreSection topic="Talents" subtopic="General" />
			<TalentTable data={generalTalents} />
		</Stack>
	);
}
