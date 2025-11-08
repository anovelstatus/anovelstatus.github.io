import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { getPatreonKey } from "@/data/localStorage";

const API_URL = import.meta.env.VITE_API_URL;

const queryClient = new QueryClient({
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
			staleTime: Infinity,
			gcTime: Infinity,
		},
	},
});

export function AppQueryProvider({ children }: PropsWithChildren) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
