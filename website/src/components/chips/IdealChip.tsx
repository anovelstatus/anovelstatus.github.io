import { Chip } from "@mui/material";

type IdealChipProps = {
	skill: Skill;
};

export default function IdealChip({ skill }: IdealChipProps) {
	if (skill.quality !== "Ideal") return null;
	return <Chip label="⭐" size="small" />;
}
