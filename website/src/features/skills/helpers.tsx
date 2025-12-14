import { toIdString } from "@/data/helpers";
import { Typography } from "@mui/material";

export function getPrerequisiteList(skill: Skill) {
	const keyPrefix = toIdString(skill) + "-prerequisite";
	const list = skill.prerequisites
		.split("\n")
		.map((x) => x.trim())
		.filter((x) => x.length > 0);

	if (list.length === 0) return [];

	if (list.length < 6) {
		return list.map((x) => (
			<Typography variant="body2" key={x}>
				{x}
			</Typography>
		));
	}

	const selected = list.slice(0, 5);
	const extra = list.slice(5);

	return [
		<Typography variant="h6" key={`${keyPrefix}-selected`}>
			Selected
		</Typography>,
		...selected.map((x, index) => (
			<Typography variant="body2" key={`${keyPrefix}-${index}`}>
				{x}
			</Typography>
		)),
		<Typography variant="h6" key={`${keyPrefix}-more`}>
			and {list.length - 5} more...
		</Typography>,
		...extra.map((x, index) => (
			<Typography variant="body2" key={`${keyPrefix}-${index + 5}`}>
				{x}
			</Typography>
		)),
	];
}
