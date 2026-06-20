import { createContext } from "react";

type ChapterState = {
	chapter: number;
	setChapter: (chapter: number) => void;
};

export const ChapterContext = createContext<ChapterState>(null!);
