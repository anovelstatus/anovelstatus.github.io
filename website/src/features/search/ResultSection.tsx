import Section from "@/components/Section";
import { type ReactElement } from "react";
import { useFilteredItems } from "./useFilteredItems";
import { Grid, Typography } from "@mui/material";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import type { LoadableData } from "@/data/api";

export type ResultSectionProps<T> = {
	title: string;
	query: string[];
	source: LoadableData<T[]>;
	keys: PlainOrRichTextKeys<T>[];
	component: (item: T) => ReactElement;
	showOnChapter: (item: T, chapter: number) => boolean;
};

export function ResultSection<T>({ title, query, source, keys, component, showOnChapter }: ResultSectionProps<T>) {
	const filtered = useFilteredItems(query, source.data, keys, showOnChapter);
	return (
		<Section title={title}>
			{source.isLoading && <LoadingPlaceholder />}
			{!source.isLoading && filtered.length === 0 && <Typography variant="body2">No results</Typography>}
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
