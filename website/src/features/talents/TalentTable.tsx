import { findByIds, toIdString } from "@/data/helpers";
import TalentCard from "./TalentCard";
import AppTable, { useAppTable } from "@/components/AppTable";
import { useTalents } from "@/data/api";
import { getExpandedRowModel } from "@tanstack/react-table";
import { useColumns, columnstyles } from "./columns";

type TalentTableProps = {
	data: Talent[];
};

export default function TalentTable({ data }: TalentTableProps) {
	const { data: talents, isFetching } = useTalents();
	const columns = useColumns();

	const table = useAppTable({
		data,
		columns,
		getRowId: (row) => toIdString(row),
		initialState: {
			sorting: [{ id: "tier", desc: true }],
		},
		narrowBreakpoint: "md",
		renderNarrowRow: ({ original }) => <TalentCard id={original} key={toIdString(original)} />,
		getExpandedRowModel: getExpandedRowModel(),
		maxLeafRowFilterDepth: 0,
		getSubRows: (row) => findByIds(talents, row.previous),
	});

	return <AppTable table={table} isLoading={isFetching} sx={columnstyles} />;
}
