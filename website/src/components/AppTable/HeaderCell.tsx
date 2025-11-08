import { useTheme, TableCell, TableSortLabel } from "@mui/material";
import { flexRender, type Header } from "@tanstack/react-table";

type HeaderCellProps<T> = {
	header: Header<T, unknown>;
};

export default function HeaderCell<T>({ header }: HeaderCellProps<T>) {
	const { column, id, getContext } = header;
	const theme = useTheme();

	const canSort = column.getCanSort();
	const isSorted = column.getIsSorted();
	const active = isSorted !== false;
	const direction = isSorted || undefined;

	const contents = flexRender(column.columnDef.header, getContext());

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
				width: header.getSize(),
			}}
		>
			{canSort ? (
				<TableSortLabel active={active} direction={direction} onClick={column.getToggleSortingHandler()}>
					{contents}
				</TableSortLabel>
			) : (
				contents
			)}
		</TableCell>
	);
}
