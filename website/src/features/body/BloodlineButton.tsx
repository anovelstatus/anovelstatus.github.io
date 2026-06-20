import { PopoverButton } from "@/components/PopoverButton";
import { popupCardStyles } from "@/styles";
import { Button, type ButtonProps } from "@mui/material";
import { BloodlineCard } from "./BloodlineCard";
import { useBloodlines } from "@/data/api";

type BloodlineButtonProps = { name: string } & ButtonProps;

export default function BloodlineButton({ name, ...props }: BloodlineButtonProps) {
	const bloodlines = useBloodlines();
	const bloodline = bloodlines.find((x) => x.name === name);
	if (!bloodline) return null;
	return (
		<PopoverButton
			id={name}
			trigger={
				<Button variant="outlined" {...props}>
					{bloodline.name} Bloodline
				</Button>
			}
			popover={() => <BloodlineCard bloodline={bloodline} sx={popupCardStyles} />}
		/>
	);
}
