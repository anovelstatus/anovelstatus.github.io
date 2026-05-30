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

/** Pages of data that can be fetched */
declare type Page =
	| "chapters"
	| "attributes"
	| "talents"
	| "titles"
	| "body"
	| "skills"
	| "statuses"
	| "achievements"
	| "lore";

declare type StandardParser<T> = (info: SpreadsheetInfo) => T;

declare type SpreadsheetInfo = {
	ss: Spreadsheet;
	chapterLimit: number;
	ranges: RangeLookup;
	attributeNames: string[];
	includePatreon: boolean;
};
