import { getBloodlines } from "./bloodlines";
import { getMutations } from "./mutations";
import { getRaces } from "./race";
import { getTempering } from "./tempering";

export const getBody: StandardParser<Body.Details> = (info) => {
	return {
		mutations: getMutations(info),
		races: getRaces(info),
		bloodlines: getBloodlines(info),
		tempering: getTempering(info),
	};
};
