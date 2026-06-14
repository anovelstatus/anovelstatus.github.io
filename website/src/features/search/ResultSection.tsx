import Section from "@/components/Section";
import { type ReactElement } from "react";
import { useFilteredItems } from "./useFilteredItems";
import { Grid } from "@mui/material";

type ResultSectionProps<T> = {
	title: string;
	query: string[];
	items: T[];
	keys: PlainOrRichTextKeys<T>[];
	component: (item: T) => ReactElement;
	showOnChapter: (item: T, chapter: number) => boolean;
};

export function ResultSection<T>({ title, query, items, keys, component, showOnChapter }: ResultSectionProps<T>) {
	const filtered = useFilteredItems(query, items, keys, showOnChapter);
	if (!filtered.length) return null;
	return (
		<Section title={title}>
			<Grid container spacing={1}>
				{filtered.map((item, index) => (
					<Grid size={{ xs: 12, md: 6, lg: 4 }} key={"result-" + title + "-" + index}>
						{component(item)}
					</Grid>
				))}
			</Grid>
		</Section>
	);
}
