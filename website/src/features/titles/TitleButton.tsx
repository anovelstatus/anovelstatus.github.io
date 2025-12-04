import { PopoverButton } from "@/components/PopoverButton";
import TieredButton from "@/components/TieredButton";
import { toIdString } from "@/data/helpers";
import TitleCard from "./TitleCard";

type TitleButtonProps = { title: TieredId };

export default function TitleButton({ title }: TitleButtonProps) {
	return (
		<PopoverButton
			id={toIdString(title)}
			trigger={<TieredButton item={title} variant="outlined" />}
			popover={() => <TitleCard id={title} sx={{ maxWidth: 500 }} />}
		/>
	);
}
