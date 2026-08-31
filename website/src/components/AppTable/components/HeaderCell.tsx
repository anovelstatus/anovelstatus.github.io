import { useTheme, TableCell, TableSortLabel } from "@mui/material";
import { FlexRender, type Header, type RowData } from "@tanstack/react-table";
import type { AppTableFeatures } from "../features";

type HeaderCellProps<T extends RowData> = {
	header: Header<AppTableFeatures, T, unknown>;
};

export default function HeaderCell<T extends RowData>({ header }: HeaderCellProps<T>) {
	const { column, id } = header;
	const theme = useTheme();

	const canSort = column.getCanSort();
	const isSorted = column.getIsSorted();
	const active = isSorted !== false;
	const direction = isSorted || undefined;

	const size = column.getSize();

	return (
		<TableCell
			variant="head"
			key={id}
			className={header.getClassName()}
			sx={{
				borderWidth: 1,
				borderBottomWidth: 4,
				borderStyle: "solid",
				borderColor: theme.palette.grey[800],
				width: size > 0 ? size + "px" : undefined,
				...header.getSx(),
			}}
		>
			{canSort ? (
				<TableSortLabel active={active} direction={direction} onClick={column.getToggleSortingHandler()}>
					<FlexRender header={header} />
				</TableSortLabel>
			) : (
				<FlexRender header={header} />
			)}
		</TableCell>
	);
}
