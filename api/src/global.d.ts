declare type Folder = GoogleAppsScript.Drive.Folder;
declare type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
declare type Range = GoogleAppsScript.Spreadsheet.Range;
/** The empty string is the default value, not undefined. But having it in here makes a lot of others simpler. */
declare type SpreadsheetValue = string | number | boolean | undefined;
declare type RichValue = GoogleAppsScript.Spreadsheet.RichTextValue | null;

/** Names of links to specific ranges in the spreadsheet ("Tables" sheet) */
declare type RangeKey =
	| "Bloodline Updates"
	| "Bloodlines"
	| "Body Tempering Stages"
	| "Body Tempering Progress"
	| "Races"
	| "Mutations"
	| "Talents"
	| "Skills"
	| "Skill Levels"
	| "Attributes"
	| "Attribute Milestones"
	| "Attribute Evolutions"
	| "Attribute Boosts"
	| "Attribute Gains"
	| "Chapter Shortcuts"
	| "Titles"
	| "Tiers";

/** Range references for various things */
declare type RangeLookup = Record<RangeKey, string>;

declare type StandardParser<T> = (info: SpreadsheetInfo) => T;

declare type SpreadsheetInfo = {
	ss: Spreadsheet;
	chapterLimit: number;
	ranges: RangeLookup;
	attributes: Attribute.Details[];
	attributeNames: string[];
	includePatreon: boolean;
};

type NamedSource = { type: "column"; name: string };
type ContainsSource = { type: "column-contains"; contains: string };

type NoOptionParse = { type: "tiered_id" | "split_tiered_id" | "rich" | "split-string" };
type OptionalParse = { type: "string" | "bool"; optional?: boolean };
type NumberParse = { type: "number" | "split-number"; limited?: boolean; optional?: boolean };
type CustomParse<T, TKey extends keyof T & string, TExtra> = {
	type: "custom";
	parse: (rowSoFar: Partial<T>, extra) => T[TKey];
};

type Field<T, TKey extends keyof T & string, TExtra> = {
	key: TKey;
	source?: NamedSource | ContainsSource;
	parse: NoOptionParse | OptionalParse | NumberParse | CustomParse<T, TKey, TExtra>;
};

declare type Table<T, TExtra = undefined> = {
	fields: Field<T, keyof T & string, TExtra>[];
	getRange: (info: SpreadsheetInfo) => Range;
	filter?: (item: T) => boolean;
	extra: TExtra;
};
