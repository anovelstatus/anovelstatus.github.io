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

const skillKeys: PlainOrRichTextKeys<Skill>[] = ["name", "description", "notes", "prerequisites"];
const talentKeys: PlainOrRichTextKeys<Talent>[] = ["name", "note", "type"];
const titleKeys: PlainOrRichTextKeys<Title>[] = ["name", "note"];
const achievementKeys: PlainOrRichTextKeys<Achievement>[] = ["description", "note", "message", "rewards"];
const loreKeys: PlainOrRichTextKeys<LoreEntry>[] = ["note", "key"];

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
						.filter((x) => x && x !== ""),
				),
			);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [inputValue]);

	const onSearchChange = (evt: ChangeEvent<HTMLInputElement>) => {
		setInputValue(evt.target.value);
	};

	const skills = useSkills();
	const titles = useTitles();
	const talents = useTalents();
	const achievements = useAchievements();
	const lore = useLore();

	const theme = useTheme();

	const sections = [
		<ResultSection
			key="skills-results-section"
			title="Skills"
			source={skills}
			keys={skillKeys}
			component={(x) => <SkillCard id={x} key={toIdString(x)} />}
			showOnChapter={(item, chapter) => item.gains.some((gain) => gain.chapter <= chapter)}
			query={debouncedValue}
		/>,
		<ResultSection
			key="talents-results-section"
			title="Talents"
			source={talents}
			keys={talentKeys}
			component={(x) => <TalentCard id={x} key={toIdString(x)} />}
			showOnChapter={(item, chapter) => item.chapterGained <= chapter}
			query={debouncedValue}
		/>,
		<ResultSection
			key="titles-results-section"
			title="Titles"
			source={titles}
			keys={titleKeys}
			component={(x) => <TitleCard id={x} key={toIdString(x)} />}
			showOnChapter={(item, chapter) => item.chapter <= chapter}
			query={debouncedValue}
		/>,
		<ResultSection
			key="achievements-results-section"
			title="Achievements"
			source={achievements}
			keys={achievementKeys}
			component={(x) => <AchievementCard achievement={x} key={toPlainText(x.description) + x.chapter} />}
			showOnChapter={(item, chapter) => item.chapter <= chapter}
			query={debouncedValue}
		/>,
		<ResultSection
			key="lore-results-section"
			title="Miscellaneous"
			source={lore}
			keys={loreKeys}
			component={(x) => <LoreCard lore={x} key={x.key + x.chapter + x.permanent} />}
			showOnChapter={(item, chapter) => item.chapter <= chapter}
			query={debouncedValue}
		/>,
	];

	const hasQuery = debouncedValue.length > 0;

	return (
		<Stack spacing={2}>
			<Typography variant="body1">Search across achievements, skills, talents, and titles:</Typography>
			<Box sx={{ position: "sticky", top: 0, width: "100%", backgroundColor: theme.palette.background.paper }}>
				<TextField onChange={onSearchChange} label="Search" variant="filled" fullWidth />
			</Box>
			{hasQuery && sections}
		</Stack>
	);
}
