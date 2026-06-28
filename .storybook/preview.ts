import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		nextjs: {
			appDirectory: true,
		},
	},
	globalTypes: {
		colorScheme: {
			description: "Color scheme",
			defaultValue: "light",
			toolbar: {
				title: "Color Scheme",
				icon: "circlehollow",
				items: [
					{ value: "light", icon: "sun", title: "Light" },
					{ value: "dark", icon: "moon", title: "Dark" },
				],
				dynamicTitle: true,
			},
		},
	},
	decorators: [
		(Story, context) => {
			const scheme = context.globals.colorScheme ?? "light";
			document.documentElement.classList.toggle("dark", scheme === "dark");
			return Story();
		},
	],
};

export default preview;
