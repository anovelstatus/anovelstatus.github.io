import { useChapter, useTalents } from "@/data/api";
import { sameId } from "@/data/helpers";
import { groupBy } from "es-toolkit";
import { useMemo } from "react";

export function useTalentGroups() {
	const chapter = useChapter();
	const { data: talents } = useTalents();

	return useMemo(() => {
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
	}, [chapter, talents]);
}
