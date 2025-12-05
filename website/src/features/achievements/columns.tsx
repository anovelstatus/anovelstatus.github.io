import { ChaptersChip, RarityChip } from "@/components/chips";
import { Typography, Stack } from "@mui/material";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

export const columns = [
	createColumnHelper<Achievement>().accessor("chapter", {
		header: "Chapter",
		size: 80,
		cell: ({ row }) => <ChaptersChip chapters={[row.original.chapter]} />,
	}),
	createColumnHelper<Achievement>().accessor("tier", {
		header: "Tier",
		size: 80,
		cell: ({ row }) => <RarityChip name={row.original.tier} />,
	}),
	createColumnHelper<Achievement>().accessor("description", {
		header: "Description",
		size: 300,
		cell: ({ row }) => (
			<Typography variant="body2" whiteSpace="pre-line">
				{row.original.description}
			</Typography>
		),
	}),
	createColumnHelper<Achievement>().display({
		header: "Message",
		size: 300,
		cell: ({ row }) => (
			<Stack>
				<Typography variant="body2" whiteSpace="pre-line">
					{row.original.message}
				</Typography>
				<Typography variant="body2" fontStyle="italic">
					Sent to {row.original.messageRecipients.join(", ")}
				</Typography>
			</Stack>
		),
	}),
	createColumnHelper<Achievement>().accessor("rewards", {
		header: "Rewards",
		size: 300,
		cell: ({ row }) => (
			<Typography variant="body2" whiteSpace="pre-line">
				{row.original.rewards}
			</Typography>
		),
	}),
	createColumnHelper<Achievement>().accessor("note", {
		header: "Other Notes",
		size: 300,
		cell: ({ row }) => (
			<Typography variant="body2" whiteSpace="pre-line">
				{row.original.note}
			</Typography>
		),
	}),
] as ColumnDef<Achievement>[];
