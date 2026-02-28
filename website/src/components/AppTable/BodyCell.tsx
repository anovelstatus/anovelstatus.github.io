import { useTheme, TableCell } from "@mui/material";
import { flexRender, type Cell } from "@tanstack/react-table";

type BodyCellProps<T> = {
	cell: Cell<T, unknown>;
};

export default function BodyCell<T>({ cell }: BodyCellProps<T>) {
	const theme = useTheme();
	const { column, getContext } = cell;

	const colSpan = cell.getColSpan();

	if (colSpan === 0) return <></>;

	const size = cell.column.getSize();

	return (
		<TableCell
			valign="top"
			variant="body"
			colSpan={colSpan}
			className={cell.getClassName()}
			sx={{
				borderWidth: 1,
				borderStyle: "solid",
				borderColor: theme.palette.grey[800],
				width: size > 0 ? size * colSpan + "px" : undefined,
				...cell.getSx(),
			}}
		>
			{flexRender(column.columnDef.cell, getContext())}
		</TableCell>
	);
}
