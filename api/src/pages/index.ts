import { getAttributes } from "./attributes/index";
import { getBody } from "./body/index";
import { getPatreonChapter, getRoyalRoadChapter, getPatreonSheetLink } from "./chapters";
import { getTimelineShortcuts } from "./shortcuts";
import { getSkills } from "./skills/index";
import { getOfficialStatuses } from "./statuses";
import { getTalents } from "./talents";
import { getTiers } from "./tiers";
import { getTitles } from "./titles";

const cache = CacheService.getScriptCache()!;

export function getPage(spreadsheet: Spreadsheet, page: Page, includePatreon: boolean, skipCache = false) {
	const chapterLimit = includePatreon ? getPatreonChapter(spreadsheet) : getRoyalRoadChapter(spreadsheet);
	const ranges = getCachedData(
		"table-ranges",
		getTableRanges,
		spreadsheet,
		{} as RangeLookup,
		[],
		chapterLimit,
		skipCache,
	);

	if (page === "chapters") {
		const tiers = getCachedData("tiers", getTiers, spreadsheet, ranges, [], chapterLimit, skipCache);
		return {
			latest: chapterLimit,
			tiers: tiers,
			unlocked: includePatreon,
			patreonSheetLink: includePatreon
				? getCachedData("patreon-sheet-link", getPatreonSheetLink, spreadsheet, null!, [], chapterLimit, skipCache)
				: undefined,
		} as BasicInfo;
	}
	const attributes = getCachedData("attributes", getAttributes, spreadsheet, ranges, [], chapterLimit, skipCache);
	const attributeNames = attributes.map((x) => x.name);

	switch (page) {
		case "attributes":
			return attributes;
		case "shortcuts":
			return getCachedData(
				"shortcuts",
				getTimelineShortcuts,
				spreadsheet,
				ranges,
				attributeNames,
				chapterLimit,
				skipCache,
			);
		case "talents":
			return getCachedData("talents", getTalents, spreadsheet, ranges, attributeNames, chapterLimit, skipCache);
		case "titles":
			return getCachedData("titles", getTitles, spreadsheet, ranges, attributeNames, chapterLimit, skipCache);
		case "body":
			return getCachedData("body", getBody, spreadsheet, ranges, attributeNames, chapterLimit, skipCache);
		case "skills":
			return getCachedData("skills", getSkills, spreadsheet, ranges, attributeNames, chapterLimit, skipCache);
		case "statuses":
			return getCachedData(
				"statuses",
				getOfficialStatuses,
				spreadsheet,
				ranges,
				attributeNames,
				chapterLimit,
				skipCache,
			);
		default:
			return "Unexpected page requested: " + page;
	}
}

function getTableRanges(ss: Spreadsheet): RangeLookup {
	const values = ss.getSheetByName("Tables")!.getDataRange().getValues();

	return values.slice(2).reduce((ranges, row) => {
		ranges[row[0] as RangeKey] = row[2];
		return ranges;
	}, {} as Partial<RangeLookup>) as RangeLookup;
}

function getCachedData<T>(
	cacheKey: string,
	getData: CacheableFunc<T>,
	ss: Spreadsheet,
	ranges: RangeLookup,
	attributeNames: string[],
	chapterLimit: number,
	skipCache: boolean,
) {
	const actualKey = cacheKey + chapterLimit;
	console.log("Loading " + actualKey);
	if (!skipCache) {
		const cachedData = cache.get(actualKey);
		if (cachedData) return JSON.parse(cachedData) as T;
		console.log(actualKey + " was not cached. Loading from spreadsheet.");
	}

	const data = getData(ss, ranges, attributeNames, chapterLimit);
	console.log(actualKey + " loaded from spreadsheet.");
	try {
		cache.put(actualKey, JSON.stringify(data), 60 * 5);
	} catch (e) {
		console.error("Failed to cache " + actualKey + ": " + (e as Error).message);
	}
	return data;
}
