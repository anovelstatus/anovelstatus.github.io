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

declare namespace Attribute {
	type Evolution = {
		chapter: number;
		name: string;
		note: RichText[];
	};

	type Milestone = {
		milestone: number;
		note: RichText[];
	};

	type Boost = {
		chapter: number;
		boost: number;
		note: RichText[];
		title: TieredId;
	};

	type Gain = {
		chapter: number;
		gain: number;
		note: RichText[];
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
		note: RichText[];
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
	note: RichText[];
};

type BloodlineStatus = {
	name: string;
	chapter: number;
	purity: string | number;
	status: string;
	note?: RichText[];
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
	description: RichText[];
	expectedSteps: number;
	updates: TemperingStep[];
};

declare type TemperingStep = {
	stage: string;
	category: string;
	started: number;
	completed: number | undefined;
	note: RichText[];
	linkType?: string;
	link?: TieredId;
};

declare namespace Body {
	type Modification = {
		name: string;
		tier?: string;
		note?: string; // todo: RichText[]
		type: string;
		source: RichText[];
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
	note: RichText[];
	bonus: string;
};

/**
 * An object that has properties related to the Attributes
 * @deprecated
 */
declare type HasSomeAttributes = Record<string, number>;

declare type Status = {
	chapter: number;
	note?: string;
	attributes: number[];
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
	chapterRevealed: number | undefined;
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
	note: RichText[];
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
		note: RichText[];
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
	replaced: boolean;
	gains: SkillGain[];
	description: RichText[];
	prerequisites: string | undefined;
	quality: string;
	bonuses: RichText[];
	notes: RichText[];
	tags: string;
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
	note: RichText[];
};

declare type Achievement = {
	chapter: number;
	tier: string;
	description: RichText[];
	message: RichText[];
	messageRecipients: string[];
	rewards: RichText[];
	note: RichText[];
};
