import { PopoverButton } from "@/components/PopoverButton";
import TieredButton from "@/components/TieredButton";
import { toIdString } from "@/data/helpers";
import { popupCardStyles } from "@/styles";
import type { ButtonProps } from "@mui/material";
import TalentCard from "./TalentCard";

type TalentButtonProps = { item: TieredId } & ButtonProps;

export default function TalentButton({ item, ...props }: TalentButtonProps) {
	return (
		<PopoverButton
			id={toIdString(item)}
			trigger={<TieredButton item={item} variant="outlined" {...props} />}
			popover={() => <TalentCard id={item} sx={popupCardStyles} />}
		/>
	);
}
