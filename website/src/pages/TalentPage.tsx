import { TalentTable } from "@/features/talents";
import { getRaceForChapter, sameId } from "@/data/helpers";
import { useTalents, useBody, useChapter } from "@/data/api";
import { Stack, Typography, Chip } from "@mui/material";
import { useMemo } from "react";

export function TalentPage() {
	const chapter = useChapter();
	const { data: talents } = useTalents();
	const { races } = useBody();

	let filtered = talents.filter((x) => !x.temporary && x.chapterGained <= chapter);
	filtered = filtered.filter((x) => !x.chapterUndone || x.chapterUndone <= chapter);
	filtered = filtered.filter((x) => !filtered.some((some) => some.previous?.some((prev) => sameId(prev, x))));

	const generalTalents = useMemo(() => filtered.filter((x) => x.type == "General"), [chapter, talents]);
	const racialTalents = useMemo(() => filtered.filter((x) => x.type == "Race"), [chapter, talents]);
	const freeTalents = useMemo(() => filtered.filter((x) => x.type == "Racial Slot"), [chapter, talents]);

	const currentRace = getRaceForChapter(races, chapter);
	const slotsUsed = freeTalents.length;
	const slots = currentRace?.freeSlots ?? 1;
	const slotsText = `${slotsUsed}/${slots} used`;

	return (
		<Stack spacing={2}>
			<Typography variant="h4" gutterBottom>
				Priam's Talents
			</Typography>
			<Typography variant="h5" gutterBottom>
				General Talents <Chip label={generalTalents.length} sx={{ fontWeight: "bold" }} />
			</Typography>
			<TalentTable data={generalTalents} />
			<Typography variant="h5" gutterBottom>
				Racial Talents <Chip label={racialTalents.length} sx={{ fontWeight: "bold" }} />
			</Typography>
			<TalentTable data={racialTalents} />
			<Typography variant="h5" gutterBottom>
				Free Racial Slots <Chip label={slotsText} sx={{ fontWeight: "bold" }} />
			</Typography>
			<TalentTable data={freeTalents} />
		</Stack>
	);
}
