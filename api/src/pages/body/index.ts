import { getBloodlines } from "./bloodlines";
import { getMutations } from "./mutations";
import { getRaces } from "./race";
import { getTempering } from "./tempering";

export const getBody: CacheableFunc<Body.Details> = (ss, ranges, attributes, chapterLimit) => {
	return {
		mutations: getMutations(ss, ranges, attributes, chapterLimit),
		races: getRaces(ss, ranges, attributes, chapterLimit),
		bloodlines: getBloodlines(ss, ranges, attributes, chapterLimit),
		tempering: getTempering(ss, ranges, attributes, chapterLimit),
	};
};
