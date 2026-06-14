import { LoreCard } from "@/components/LoreCard";
import { toPlainText } from "@/components/RichTextSpan";
import { useAchievements, useLore, useSkills, useTalents, useTitles } from "@/data/api";
import { toIdString } from "@/data/helpers";
import AchievementCard from "@/features/achievements/AchievementCard";
import { ResultSection } from "@/features/search/ResultSection";
import { SkillCard } from "@/features/skills";
import { TalentCard } from "@/features/talents";
import { TitleCard } from "@/features/titles";
import { Box, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState, useTransition, type ChangeEvent } from "react";

const skillKeys: PlainOrRichTextKeys<Skill>[] = ["name", "description", "notes", "prerequisites", "tags"];
const talentKeys: PlainOrRichTextKeys<Talent>[] = ["name", "note", "type"];
const titleKeys: PlainOrRichTextKeys<Title>[] = ["name", "note"];
const achievementKeys: PlainOrRichTextKeys<Achievement>[] = ["description", "note", "message", "rewards"];

export function SearchPage() {
	const [inputValue, setInputValue] = useState("");
	const [debouncedValue, setDebouncedValue] = useState([] as string[]);
	const [_, startTransition] = useTransition();

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			startTransition(() =>
				setDebouncedValue(
					inputValue
						.toLowerCase()
						.split(" ")
						.filter((x) => x),
				),
			);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [inputValue]);

	const onSearchChange = (evt: ChangeEvent<HTMLInputElement>) => {
		setInputValue(evt.target.value);
	};

	const { data: skills } = useSkills();
	const { data: titles } = useTitles();
	const { data: talents } = useTalents();

	const { data: achievements } = useAchievements();

	const { data: lore } = useLore();

	const theme = useTheme();

	return (
		<Stack spacing={2}>
			<Typography variant="body1">Search across achievements, skills, talents, and titles:</Typography>
			<Box sx={{ position: "sticky", top: 0, width: "100%", backgroundColor: theme.palette.background.paper }}>
				<TextField onChange={onSearchChange} label="Search" variant="filled" fullWidth />
			</Box>
			<ResultSection
				title="Skills"
				items={skills}
				keys={skillKeys}
				component={(x) => <SkillCard id={x} key={toIdString(x)} />}
				showOnChapter={(item, chapter) => item.gains.some((gain) => gain.chapter <= chapter)}
				query={debouncedValue}
			/>
			<ResultSection
				title="Talents"
				items={talents}
				keys={talentKeys}
				component={(x) => <TalentCard id={x} key={toIdString(x)} />}
				showOnChapter={(item, chapter) => item.chapterGained <= chapter}
				query={debouncedValue}
			/>
			<ResultSection
				title="Titles"
				items={titles}
				keys={titleKeys}
				component={(x) => <TitleCard id={x} key={toIdString(x)} />}
				showOnChapter={(item, chapter) => item.chapter <= chapter}
				query={debouncedValue}
			/>
			<ResultSection
				title="Achievements"
				items={achievements}
				keys={achievementKeys}
				component={(x) => <AchievementCard achievement={x} key={toPlainText(x.description) + x.chapter} />}
				showOnChapter={(item, chapter) => item.chapter <= chapter}
				query={debouncedValue}
			/>
			<ResultSection
				title="Miscellaneous"
				items={lore}
				keys={["note", "key"]}
				component={(x) => <LoreCard lore={x} key={toPlainText(x.key) + x.chapter} />}
				showOnChapter={(item, chapter) => item.chapter <= chapter}
				query={debouncedValue}
			/>
		</Stack>
	);
}
