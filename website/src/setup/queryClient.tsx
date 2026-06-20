import { QueryClient } from "@tanstack/react-query";
import { getPatreonKey } from "@/data/localStorage";

const API_URL = import.meta.env.VITE_API_URL;
const oneHour = 1 * 60 * 60 * 1_000;

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: async ({ queryKey }) => {
				const key = getPatreonKey();
				const urlParams = new URLSearchParams({ page: queryKey[1] as string, key: key });
				const response = await fetch(API_URL + "?" + urlParams.toString(), {
					method: "GET",
				});
				return response.json();
			},
			throwOnError: true,
			staleTime: oneHour,
			gcTime: oneHour * 6,
		},
	},
});
