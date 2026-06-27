import {
	CircularProgress,
	Paper,
	Stack,
	Table as TableComponent,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { type ReactElement } from "react";
import {
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type Table,
	type TableOptions,
} from "@tanstack/react-table";
import { ColSpanFeature } from "./features/ColSpanFeature";
import { NarrowFeature } from "./features/NarrowFeature";
import HeaderCell from "./components/HeaderCell";
import BodyCell from "./components/BodyCell";
import { ClassNameFeature } from "./features/ClassNameFeature";
import { SxFeature } from "./features/SxFeature";
import { HoverTitleFeature } from "./features/HoverTitleFeature";
import type { PropsWithStyle } from "@/types";
import { HideHeaderFeature } from "./features/HideHeaderFeature";

type TableProps<T> = {
	table: Table<T>;
	isLoading?: boolean;
	size?: "small" | "medium";
} & PropsWithStyle;

export function useAppTable<T>(options: Partial<TableOptions<T>>) {
	const features = [
		NarrowFeature,
		ColSpanFeature,
		ClassNameFeature,
		HoverTitleFeature,
		HideHeaderFeature,
		SxFeature,
		...(options._features ?? []),
	];
	return useReactTable({
		debugTable: true,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		...options,
		_features: features,
	} as TableOptions<T>);
}

export default function AppTable<T>({ sx, table, isLoading, size = "medium" }: TableProps<T>): ReactElement {
	const theme = useTheme();

	const isNarrow = useMediaQuery(theme.breakpoints.down(table.getNarrowBreakpoint()));
	const showHeader = table.getShowHeader();

	if (isLoading)
		return (
			<Stack direction="row" sx={{ alignItems: "center" }}>
				<CircularProgress size="16px" />
				Loading...
			</Stack>
		);

	if (isNarrow && table.options.renderNarrowRow)
		return (
			<>
				{table
					.getRowModel()
					.rows.filter((x) => x.depth == 0)
					.map((row) => table.options.renderNarrowRow!(row))}
			</>
		);

	return (
		<TableContainer sx={sx} component={Paper}>
			<TableComponent className="w-full " size={size}>
				{showHeader && (
					<TableHead>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return <HeaderCell key={header.id} header={header} />;
								})}
							</TableRow>
						))}
					</TableHead>
				)}
				<TableBody>
					{table.getRowModel().rows.map((row) => {
						return (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => {
									return <BodyCell key={cell.id} cell={cell} />;
								})}
							</TableRow>
						);
					})}
				</TableBody>
			</TableComponent>
		</TableContainer>
	);
}
