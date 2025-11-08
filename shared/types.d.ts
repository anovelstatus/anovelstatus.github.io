declare namespace Attribute {
	type Evolution = {
		chapter: number;
		name: string;
		note: string;
	};

	type Milestone = {
		milestone: number;
		note: string;
	};

	type Boost = {
		chapter: number;
		boost: number;
		note: string;
		title: string;
	};

	type Details = {
		name: string;
		abbreviation: string;
		category: string;
		categoryAbbreviation: string;
		note: string;
		milestones: Milestone[];
		evolutions: Evolution[];
		boosts: Boost[];
	};
}

declare type Race = {
	name: string;
	tier: number;
	chapter: number;
	talents: TieredId[];
	freeSlots: number;
	note: string;
};

type BloodlineStatus = {
	name: string;
	chapter: number;
	purity: string | number;
	status: string;
	note?: string;
};

declare type Bloodline = {
	name: string;
	updates: BloodlineStatus[];
	title: TieredId;
	lore: string;
};

declare namespace Body {
	type Modification = {
		name: string;
		tier: string;
		note: string;
		type: string;
		source: string;
		chapters: number[];
	};

	type Details = {
		mutations: Modification[];
		races: Race[];
		bloodlines: Bloodline[];
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

declare type TieredId = {
	name: string;
	tier: string;
};

/** Something that was the result of an upgrade or merge */
declare type HasPrevious = {
	previous: TieredId[];
};

declare type TalentType = "General" | "Race" | "Racial Slot";

declare type Talent = TieredId &
	HasPrevious & {
		note: string;
		chapterGained: number;
		chapterUndone?: number;
		chapterReplaced?: number[];
		type: TalentType;
		growth?: boolean;
		temporary: boolean;
	};

/** Skill metadata */
declare type Skill = TieredId &
	HasSomeAttributes &
	HasPrevious & {
		replaced: boolean;
		gains: SkillGain[];
	};

declare type SkillGain = {
	chapter: number;
	count: number;
	note: string;
};

declare type Title = TieredId & {
	chapter: number;
	replaced?: number;
	previous?: TieredId;
	note: string;
};
