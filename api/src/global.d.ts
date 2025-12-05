declare type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
/** The empty string is the default value, not undefined. But having it in here makes a lot of others simpler. */
declare type SpreadsheetValue = string | number | boolean | undefined;

/** Names of links to specific ranges in the spreadsheet ("Tables" sheet) */
declare type RangeKey =
	| "Bloodline Updates"
	| "Bloodlines"
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
	| "shortcuts"
	| "talents"
	| "titles"
	| "body"
	| "skills"
	| "statuses"
	| "achievements";

/** Keys for data cache - all the pages + one that stores where to find those pages */
declare type CacheKey = Page | "table-ranges";

declare type CacheableFunc<T> = (
	ss: Spreadsheet,
	ranges: RangeLookup,
	attributeNames: string[],
	chapterLimit: number,
) => T;
