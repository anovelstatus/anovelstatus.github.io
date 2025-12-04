import { PopoverButton } from "@/components/PopoverButton";
import TieredButton from "@/components/TieredButton";
import { toIdString } from "@/data/helpers";
import SkillCard from "./SkillCard";

type SkillButtonProps = { skill: TieredId };

export default function SkillButton({ skill }: SkillButtonProps) {
	return (
		<PopoverButton
			id={toIdString(skill)}
			trigger={<TieredButton item={skill} variant="outlined" />}
			popover={() => <SkillCard id={skill} sx={{ maxWidth: 500 }} />}
		/>
	);
}
