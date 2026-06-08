import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/test/setup.ts"],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		setupFiles: ["./src/test/setup.tsx"],
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov", "html"],
			include: [
				"src/components/wallet/**",
				"src/components/analytics/**",
				"src/utils/**",
				"src/hooks/**",
				"src/mock-data/**",
				"src/app/**/wallets/**",
				"src/app/**/analytics/**",
			],
			exclude: ["src/test/**", "**/*.d.ts"],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
