import { validateEnv } from "./src/lib/env";

// Validate environment variables at build/startup time
validateEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		turbo: {
			rules: {
				"*.css": {
					loaders: ["@tailwindcss/vite"],
				},
			},
		},
	},
};

export default nextConfig;
