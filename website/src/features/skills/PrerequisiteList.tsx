import { toIdString } from "@/data/helpers";
import { Typography, type SxProps, type Theme } from "@mui/material";

type PrerequisiteListProps = {
	skill: Skill;
	headerSx?: SxProps<Theme>;
};

export function PrerequisiteList({ skill, headerSx }: PrerequisiteListProps) {
	const list =
		skill.prerequisites
			?.split("\n")
			.map((x) => x.trim())
			.filter((x) => x.length > 0) ?? [];

	if (list.length === 0) return <></>;

	const elements = getList(skill, list);
	return (
		<>
			<Typography variant="h6" sx={headerSx}>
				Ideal Prerequisites:
			</Typography>
			{elements}
		</>
	);
}

function getList(skill: Skill, list: string[]) {
	const keyPrefix = toIdString(skill) + "-prerequisite";
	if (list.length < 6) {
		return list.map((x, index) => (
			<Typography variant="body2" key={`${keyPrefix}-${index}`}>
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
