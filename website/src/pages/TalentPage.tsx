import { TalentTable } from "@/features/talents";
import { sameId } from "@/data/helpers";
import { useTalents, useChapter, useRaceOnChapter, useLoreTopic } from "@/data/api";
import { Stack, Typography, Chip } from "@mui/material";
import { useMemo } from "react";
import { groupBy } from "es-toolkit";
import { RichTextSpan } from "@/components/RichTextSpan";

export function TalentPage() {
	const chapter = useChapter();
	const { data: talents } = useTalents();
	const talentLore = useLoreTopic("Talents", chapter);
	const currentRace = useRaceOnChapter(chapter);

	const grouped = useMemo(() => getTalentGroups(talents, chapter), [chapter, talents]);

	const generalTalents = grouped["General"] ?? [];
	const freeTalents = grouped["Racial Slot"] ?? [];

	const otherTypes = Object.keys(grouped)
		.filter((x) => x != "General" && x != "Racial Slot")
		.toSorted();

	const slots = currentRace?.freeSlots ?? 1;
	const slotsText = `${freeTalents.length}/${slots} slots used`;

	return (
		<Stack spacing={2}>
			<Typography variant="h4" gutterBottom>
				Priam's Talents
			</Typography>
			<RichTextSpan data={talentLore.description} />
			<Typography variant="h5" gutterBottom>
				Free Racial Slots <Chip label={slotsText} sx={{ fontWeight: "bold" }} />
			</Typography>
			<TalentTable data={freeTalents} />
			{otherTypes.map((type) => (
				<>
					<Typography variant="h5" gutterBottom>
						{type || "Uncategorized"} Talent{grouped[type]!.length !== 1 ? "s" : ""}{" "}
						<Chip label={grouped[type]!.length} sx={{ fontWeight: "bold" }} />
					</Typography>
					<TalentTable data={grouped[type]!} />
				</>
			))}
			<Typography variant="h5" gutterBottom>
				General Talent{generalTalents.length !== 1 ? "s" : ""}{" "}
				<Chip label={generalTalents.length} sx={{ fontWeight: "bold" }} />
			</Typography>
			<TalentTable data={generalTalents} />
		</Stack>
	);
}

function getTalentGroups(talents: Talent[], chapter: number) {
	let filtered = talents
		// Remove "temporary" ones, like those that went into a Race talent
		.filter((x) => !x.temporary)
		// Remove ones that haven't been gained yet
		.filter((x) => x.chapterGained <= chapter)
		// Remove ones that have been undone
		.filter((x) => !x.chapterUndone || x.chapterUndone <= chapter);

	// Now remove ones that are replaced by another one in the remaining list
	filtered = filtered.filter((x) => !filtered.some((some) => some.previous?.some((prev) => sameId(prev, x))));

	return groupBy(filtered, (x) => x.type);
}
