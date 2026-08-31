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
import { useTable, type ReactTable, type RowData, type Table, type TableOptions } from "@tanstack/react-table";
import HeaderCell from "./components/HeaderCell";
import BodyCell from "./components/BodyCell";
import type { PropsWithStyle } from "@/types";
import { features, type AppTableFeatures } from "./features";
export { type AppTableFeatures } from "./features";

type TableProps<T extends RowData> = {
	table: Table<AppTableFeatures, T>;
	isLoading?: boolean;
	size?: "small" | "medium";
} & PropsWithStyle;

// type PartialTableOptions<T> = Omit<Partial<TableOptions<T>> & Pick<TableOptions<T>, "data" | "columns">, "_features">;
// todo: switch to tableOptions helper or createTableHook to provide a base but require columns + data?
export function useAppTable<T extends RowData>(
	options: Partial<TableOptions<AppTableFeatures, T>>,
): ReactTable<AppTableFeatures, T> {
	return useTable({
		...options,
		features: features,
	} as TableOptions<AppTableFeatures, T>);
}

export default function AppTable<T extends RowData>({
	sx,
	table,
	isLoading,
	size = "medium",
}: TableProps<T>): ReactElement {
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
