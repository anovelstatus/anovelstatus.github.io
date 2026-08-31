import { useTheme, TableCell } from "@mui/material";
import { FlexRender, type Cell, type RowData } from "@tanstack/react-table";
import type { TableFeatures } from "../features";

type BodyCellProps<T extends RowData> = {
	cell: Cell<TableFeatures, T, unknown>;
};

export default function BodyCell<T extends RowData>({ cell }: BodyCellProps<T>) {
	const theme = useTheme();

	const colSpan = cell.getColSpan();

	if (cell.getIsCovered()) return null;

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
				width: size > 0 ? size + "px" : undefined,
				...cell.getSx(),
			}}
			title={cell.getTitle()}
		>
			<FlexRender cell={cell} />
		</TableCell>
	);
}
