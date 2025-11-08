import { Chip } from "@mui/material";

type TierChipProps = {
	tier: number;
};

export default function TierChip({ tier }: TierChipProps) {
	return <Chip label={"T" + tier} size="small" />;
}
