import { Typography, Box } from "@mui/material";
import { ChaptersChip } from "../../components/chips";
import { useChapter, useStatuses } from "@/data/api";
import { getPastBoosts, getStatus } from "./helpers";

export type AttributeDetailsProps = {
	attribute: Attribute.Details;
};

export function BoostList({ attribute }: AttributeDetailsProps) {
	const chapter = useChapter();
	const { data: statuses } = useStatuses();
	const status = getStatus(statuses, chapter);
	const pastBoosts = getPastBoosts(chapter, attribute);

	if (!status) return <></>;

	const items = pastBoosts.map((x, index) => (
		<li key={index}>
			<Box>
				<Typography component="span" variant="body2">
					<span style={{ fontWeight: "bold" }}>{x.boost * 100}%</span> from {x.title}
					{x.note ? " (" + x.note + ")" : undefined}{" "}
				</Typography>
				<ChaptersChip chapters={[x.chapter]} />
			</Box>
		</li>
	));

	if (items.length === 0) {
		items.push(
			<li key={0}>
				<Box>
					<Typography component="span" variant="body2">
						No titles impacting {attribute.name}.
					</Typography>
				</Box>
			</li>,
		);
	}

	return <ul style={{ marginTop: "8px", marginBottom: 0, paddingBottom: "8px" }}>{items}</ul>;
}
