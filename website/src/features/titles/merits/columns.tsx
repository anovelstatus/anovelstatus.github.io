import { Stack, Typography, type SxProps, type Theme } from "@mui/material";
import { ChaptersChip, RarityChip } from "@/components/chips";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { createCollapsedTierColumn } from "@/components/AppTable/columns";
import { useChapter, useMetalTiers, useTitles } from "@/data/api";
import { RichTextSpan } from "@/components/RichTextSpan";
import { WrappedRow } from "@/components/WrappedRow";
import { useMemo } from "react";
import { getPreviousTitleChain } from "../helpers";
import { maxBy } from "es-toolkit";

export const columnstyles: SxProps<Theme> = {
	".bought": {
		backgroundColor: "#408d40",
	},
	".unknown": {
		textAlign: "center",
		color: "#666",
	},
	".MuiTable-root": {
		width: 150 + 100 + 200 * 10 + "px",
	},
};

export const useColumns = () => {
	const columnHelper = createColumnHelper<Title>();
	const metalTiers = useMetalTiers();
	const chapter = useChapter();
	const columns = [
		{
			accessorKey: "name",
			header: "Title",
			size: 150,
			enableSorting: true,
			cell: ({ row }) => (
				<WrappedRow sx={{ paddingLeft: `${row.depth}rem` }}>
					<Typography variant="subtitle1">{row.original.name}</Typography>
					<RarityChip name={row.original.tier} />
				</WrappedRow>
			),
			meta: {
				bodyColSpan: 2,
			},
		},
		createCollapsedTierColumn<Title>(metalTiers),
	] as ColumnDef<Title>[];

	for (let i = 0; i < 10; i++) {
		columns.push(
			columnHelper.display({
				id: "tier-" + i,
				header: "Tier " + i,
				size: 200,
				cell: ({ row }) => {
					const chain = useTitleChain(row.original);
					const merit = getMerit(chain, i, chapter);
					// todo: Locked until title is Tier XYZ
					if (!merit) return "?";

					return (
						<Stack>
							<RichTextSpan data={merit.text} />
							{merit.chBought && <ChaptersChip chapters={merit.chBought} />}
						</Stack>
					);
				},
				meta: {
					bodyClassName: (cell): string => {
						const chain = useTitleChain(cell.row.original);
						const merit = getMerit(chain, i, chapter);
						if (!merit) return "unknown";
						if (merit.chBought && merit.chBought <= chapter) {
							return "bought";
						}
						return "";
					},
					headerSx: { textAlign: "center" },
				},
			}),
		);
	}
	return columns;
};

function useTitleChain(title: Title) {
	const { data: titles } = useTitles();
	return useMemo(() => {
		const chain = toChain(title, titles);
		return chain;
	}, [title, titles]);
}

function toChain(title: Title, titles: Title[]) {
	const previous = getPreviousTitleChain(titles, title);
	return [title, ...previous];
}

function getMerit(chain: Title[], meritTier: number, chapter: number): TitleMerit | undefined {
	for (const title of chain) {
		const titleMerits = (title.merits ?? []).filter((x) => x.tier === meritTier && x.chReveal <= chapter);
		if (titleMerits.length === 0) continue;
		return maxBy(titleMerits, (x) => x.chReveal);
	}
	return;
}
