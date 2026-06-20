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
import { ColSpanFeature } from "./ColSpanFeature";
import { NarrowFeature } from "./NarrowFeature";
import HeaderCell from "./HeaderCell";
import BodyCell from "./BodyCell";
import { ClassNameFeature } from "./ClassNameFeature";
import { SxFeature } from "./SxFeature";
import { HoverTitleFeature } from "./HoverTitleFeature";
import type { PropsWithStyle } from "@/types";

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
				<TableHead>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return <HeaderCell key={header.id} header={header} />;
							})}
						</TableRow>
					))}
				</TableHead>
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
