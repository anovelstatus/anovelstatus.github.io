import { PopoverButton } from "@/components/PopoverButton";
import TieredButton from "@/components/TieredButton";
import { toIdString } from "@/data/helpers";
import TitleCard from "./TitleCard";
import { popupCardStyles } from "@/styles";
import type { ButtonProps } from "@mui/material";

type TitleButtonProps = { item: TieredId } & ButtonProps;

export default function TitleButton({ item: title, ...props }: TitleButtonProps) {
	return (
		<PopoverButton
			id={toIdString(title)}
			trigger={<TieredButton item={title} variant="outlined" {...props} />}
			popover={() => <TitleCard id={title} sx={popupCardStyles} />}
		/>
	);
}
