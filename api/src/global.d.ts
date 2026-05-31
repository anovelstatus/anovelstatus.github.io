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

declare type SpreadsheetInfo = {
	ss: Spreadsheet;
	chapterLimit: number;
	ranges: RangeLookup;
	attributes: Attribute.Details[];
	attributeNames: string[];
	includePatreon: boolean;
};

type NamedSource = { type: "exact"; name: string };
type ContainsSource = { type: "contains"; contains: string };

type CustomContext<T> = {
	/** What has been parsed for this table row so far */
	rowSoFar: Partial<T>;
	/** Value in the current column, if a source was set */
	value: SpreadsheetValue;
};

type Field<T, TKey extends keyof T & string> = {
	key: TKey;
	/**
	 * Find table column by exact name, or containing a specific phrase.
	 * Or don't find a column at all for custom ones.
	 */
	source?: NamedSource | ContainsSource;
	parse:
		| "split_tiered_id"
		| "rich"
		| "split_string"
		| "string_number"
		| "tiered_id"
		| "string"
		| "bool"
		| "number"
		| "split_number"
		| ((context: CustomContext<T>) => T[TKey]);
	/** Only applies to tiered_id, string, bool, number, and split_number */
	optional?: boolean;
	/** Only applies to numbers */
	limited?: boolean;
};

declare type Table<T> = {
	fields: Field<T, keyof T & string>[];
	range: Range;
};

/**
 * Randomly-generated string that users should paste into the website
 * in order to get not just public Royal Road info, but also the Patreon info.
 */
declare const PATREON_KEY: string;

/** Link to main Patreon Character Sheet */
declare const PATREON_SHEET: string;

/** Link to detail Spreadsheet with all the data for the website */
declare const SS_LINK: string;

/** ID of Google Drive folder with data files for public readers */
declare const RR_FOLDER: string;

/** ID of Google Drive folder with data files for Patreon readers */
declare const PATREON_FOLDER: string;
