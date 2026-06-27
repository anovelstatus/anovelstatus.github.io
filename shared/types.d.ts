/** Get keys from type T where T's properties for those keys are of type TValue */
declare type KeysMatching<T, TValue> = keyof { [P in keyof T as T[P] extends TValue ? P : never]: P } & keyof T;

/** Pages of data that can be fetched */
declare type ApiPage =
	| "chapters"
	| "attributes"
	| "talents"
	| "titles"
	| "body"
	| "skills"
	| "statuses"
	| "soul"
	| "achievements"
	| "lore";

declare type RichText = {
	/** Text */
	t: string;
	/** Foreground Color */
	c?: string;
	/** Bold */
	b?: boolean;
	/** Italic */
	i?: boolean;
	/** Strikethrough */
	s?: boolean;
	/** Underline */
	u?: boolean;
};

declare type ItemLink = {
	id: string;
	type: "Talent" | "Skill" | "Title" | "Bloodline";
};

declare type ChapterNote = { ch: number; t: string };

declare type RichTextSpans = RichText[] | undefined;
/** Get keys from type T where T has a string or rich text metadata */
declare type PlainOrRichTextKeys<T> = KeysMatching<T, string | RichTextSpans>;

declare namespace Attribute {
	type Evolution = {
		chapter: number;
		name: string;
		note: RichTextSpans;
		link?: ItemLink;
	};

	type Milestone = {
		milestone: number;
		note: RichTextSpans;
		link?: ItemLink;
	};

	type Boost = {
		chapter: number;
		boost: number;
		note: RichTextSpans;
		title: TieredId;
	};

	type Gain = {
		chapter: number;
		gain: number;
		note: RichTextSpans;
	};

	type Basic = {
		name: string;
		abbreviation: string;
		category: string;
		categoryAbbreviation: string;
	};

	type Details = Basic & {
		index: number;
		color: string;
		note: RichTextSpans;
		milestones: Milestone[];
		evolutions: Evolution[];
		boosts: Boost[];
		gains: Gain[];
	};
}

declare type Race = {
	name: string;
	tier: number;
	chapter: number;
	talents: TieredId[];
	freeSlots: number;
	note: RichTextSpans;
};

type BloodlineStatus = {
	name: string;
	chapter: number;
	purity: string | number;
	status: string;
	note?: RichTextSpans;
	title?: TieredId;
};

declare type Bloodline = {
	name: string;
	updates: BloodlineStatus[];
	lore: string;
	quality: string;
};

declare type TemperingStage = {
	name: string;
	tier: string;
	chapter: number;
	description: RichTextSpans;
	expectedSteps: number;
	updates: TemperingStep[];
};

declare type TemperingStep = {
	stage: string;
	category: string;
	started: number;
	completed: number | undefined;
	note: RichTextSpans;
	link?: ItemLink;
};

declare namespace Body {
	type Modification = {
		name: string;
		tier?: string;
		note?: string; // todo: RichTextSpans
		type: string;
		source: RichTextSpans;
		chapters: number[];
	};

	type Details = {
		mutations: Modification[];
		races: Race[];
		bloodlines: Bloodline[];
		tempering: TemperingStage[];
	};
}

declare type SoulDetails = {
	supremacies: Supremacies;
};

declare type Supremacies = Record<string, SupremacyStage[]>;

declare type SupremacyStage = {
	chapter: number;
	stage: number;
	note: RichTextSpans;
	bonus: string;
};

declare type OfficialStatus = {
	note?: string;
	attributes?: number[];
};

declare type FoundStatus = {
	chapter: number;
	attributes: number[];
};

declare type TribulationThreshold = {
	threshold: number;
	counts: number[];
};

declare type BasicInfo = {
	latest: number;
	unlocked: boolean;
	patreonSheetLink?: string;
	tiers: TierInfo[];
	shortcuts: Shortcut[];
	attributes: Attribute.Basic[];
};

declare type TierInfo = {
	tier: number;
	skillName: string;
	metalName: string;
	chapterRevealed?: number;
	fgColor: string;
	bgColor: string;
};

declare type Shortcut = {
	chapter: number;
	label: string;
	group?: string;
	menu?: string;
};

declare type Lore = {
	descriptions: LoreEntry[];
	updates: LoreEntry[];
};

declare type LoreEntry = {
	chapter: number;
	key: string;
	note: RichTextSpans;
	permanent?: boolean;
};

/** Something that has a tier */
declare type HasTier = {
	tier: string;
};

/** A skill, title, or other thing that is named and tiered */
declare type TieredId = {
	name: string;
} & HasTier;

/** Something that was the result of an upgrade or merge */
declare type HasPrevious = {
	previous: TieredId[];
};

declare type Talent = TieredId &
	HasPrevious & {
		note: RichTextSpans;
		chapterGained: number;
		chapterUndone?: number;
		chapterReplaced?: number[];
		type: string;
		growth?: boolean;
		temporary?: boolean;
	};

/** Skill metadata */
declare type SkillDetails = {
	attributes: number[];
	chReplaced?: number;
	gains: SkillGain[];
	description: RichTextSpans;
	prerequisites: string | undefined;
	quality: string;
	bonuses: RichTextSpans;
	notes: RichTextSpans;
	tags: string[];
	adjustment?: number;
};
declare type Skill = TieredId & SkillDetails & HasPrevious;

declare type SkillGain = {
	chapter: number;
	count: number;
	note: string; // NOT RichText because these are short and simple
};

declare type Title = TieredId & {
	chapter: number;
	replaced?: number;
	previous?: TieredId;
	note: RichTextSpans;
	merits: TitleMerit[];
	treeOverride?: TieredId;
	noTreeReason?: string;
};

declare type TitleMerit = {
	tier: number;
	text: RichTextSpans;
	chReveal: number;
	chBought?: number;
	notes: ChapterNote[];
};

declare type MeritTree = {
	titles: Title[];
	merits: TitleMerit[][];
};

declare type Achievement = {
	chapter: number;
	tier: string;
	description: RichTextSpans;
	message: RichTextSpans;
	messageRecipients: string[];
	rewards: RichTextSpans;
	note: RichTextSpans;
};
