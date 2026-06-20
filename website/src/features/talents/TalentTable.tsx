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
	const { data: allTalents, isLoading } = useTalents();
	const columns = useColumns();

	const table = useAppTable({
		data,
		columns,
		hideHeader: true,
		getRowId: (row, _, parent) => toIdString(row) + toIdString(parent?.original),
		narrowBreakpoint: "md",
		renderNarrowRow: ({ original, depth }) => <TalentCard id={original} key={depth + toIdString(original)} />,
		getExpandedRowModel: getExpandedRowModel(),
		maxLeafRowFilterDepth: 0,
		getSubRows: (row) => findByIds(allTalents, row.previous),
		enableSorting: false,
	});

	return <AppTable table={table} isLoading={isLoading} sx={columnstyles} />;
}
