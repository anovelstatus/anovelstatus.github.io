declare type RichText = {
	text: string;
	fgColor: string;
	bold: boolean;
	italic: boolean;
	strikethrough: boolean;
	underline: boolean;
};

declare namespace Attribute {
	type Evolution = {
		chapter: number;
		name: string;
		note: RichText[] | string;
	};

	type Milestone = {
		milestone: number;
		note: RichText[] | string;
	};

	type Boost = {
		chapter: number;
		boost: number;
		note: RichText[] | string;
		title: string;
		titleId: TieredId;
	};

	type Gain = {
		chapter: number;
		attribute: string;
		gain: number;
		note: RichText[] | string;
	};

	type Details = {
		name: string;
		abbreviation: string;
		category: string;
		categoryAbbreviation: string;
		color: string;
		note: RichText[] | string;
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
	note?: RichText[] | string;
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
	description: RichText[] | string;
	expectedSteps: number;
	updates: TemperingStep[];
};

declare type TemperingStep = {
	stage: string;
	category: string;
	started: number;
	completed?: number;
	note: RichText[];
	linkType?: string;
	link?: TieredId;
};

declare namespace Body {
	type Modification = {
		name: string;
		tier: string;
		note: string; // todo: RichText[]
		type: string;
		source: RichText[] | string;
		chapters: number[];
	};

	type Details = {
		mutations: Modification[];
		races: Race[];
		bloodlines: Bloodline[];
		tempering: TemperingStage[];
	};
}

/** An object that has properties related to the Attributes */
declare type HasSomeAttributes = Record<string, number>;

declare type Status = HasSomeAttributes & {
	chapter: number;
};

declare type BasicInfo = {
	latest: number;
	unlocked: boolean;
	patreonSheetLink?: string;
	tiers: TierInfo[];
};

declare type TierInfo = {
	tier: number;
	skillName: string;
	metalName: string;
	chapterRevealed: number;
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

declare type TalentType = "General" | "Race" | "Racial Slot";

declare type Talent = TieredId &
	HasPrevious & {
		note: RichText[] | string;
		chapterGained: number;
		chapterUndone?: number;
		chapterReplaced?: number[];
		type: TalentType;
		growth?: boolean;
		temporary: boolean;
	};

/** Skill metadata */
declare type SkillDetails = {
	replaced: boolean;
	gains: SkillGain[];
	description: RichText[] | string;
	prerequisites: string;
	quality: string;
	bonuses: RichText[] | string;
	notes: RichText[] | string;
	tags: string;
};
declare type Skill = TieredId & SkillDetails & HasSomeAttributes & HasPrevious;

declare type SkillGain = {
	chapter: number;
	count: number;
	note: string; // NOT RichText because these are short and simple
};

declare type Title = TieredId & {
	chapter: number;
	replaced?: number;
	previous?: TieredId;
	note: RichText[] | string;
};

declare type Achievement = {
	chapter: number;
	tier: string;
	description: RichText[] | string;
	message: RichText[] | string;
	messageRecipients: string[];
	rewards: RichText[] | string;
	note: RichText[] | string;
};
