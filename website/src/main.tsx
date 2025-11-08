import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppQueryProvider, AppRouterProvider, AppThemeProvider } from "@/providers";
import "./global.d.ts";

const container = document.getElementById("root")!;
if (!container.innerHTML) {
	const root = ReactDOM.createRoot(container);
	root.render(
		<StrictMode>
			<AppQueryProvider>
				<AppThemeProvider>
					<AppRouterProvider />
				</AppThemeProvider>
				<ReactQueryDevtools />
			</AppQueryProvider>
		</StrictMode>,
	);
}
