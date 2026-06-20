import { parseId } from "@/data/helpers";
import BloodlineButton from "@/features/body/BloodlineButton";
import { SkillButton } from "@/features/skills";
import { TalentButton } from "@/features/talents";
import { TitleButton } from "@/features/titles";

type ItemLinkButtonProps = {
	link?: ItemLink;
};

export function ItemLinkButton({ link }: ItemLinkButtonProps) {
	if (!link) return null;
	if (link.type === "Skill") return <SkillButton item={parseId(link.id)} />;
	if (link.type === "Title") return <TitleButton item={parseId(link.id)} />;
	if (link.type === "Talent") return <TalentButton item={parseId(link.id)} />;
	if (link.type === "Bloodline") return <BloodlineButton name={link.id} />;
	return null;
}
