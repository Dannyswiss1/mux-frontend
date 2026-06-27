import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { NetworkFilter } from "./NetworkFilter";

const meta: Meta<typeof NetworkFilter> = {
	title: "Wallet/NetworkFilter",
	component: NetworkFilter,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		selectedNetwork: {
			control: "select",
			options: ["all", "mainnet", "testnet"],
			description: "Currently active network filter",
		},
		disabled: {
			control: "boolean",
			description: "Disable all filter buttons",
		},
	},
	args: {
		onNetworkChange: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof NetworkFilter>;

export const AllNetworks: Story = {
	args: {
		selectedNetwork: "all",
	},
};

export const MainnetSelected: Story = {
	args: {
		selectedNetwork: "mainnet",
	},
};

export const TestnetSelected: Story = {
	args: {
		selectedNetwork: "testnet",
	},
};

export const Disabled: Story = {
	args: {
		selectedNetwork: "all",
		disabled: true,
	},
};
