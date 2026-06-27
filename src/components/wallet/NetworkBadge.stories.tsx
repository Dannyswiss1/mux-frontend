import type { Meta, StoryObj } from "@storybook/react";
import { NetworkBadge } from "./NetworkBadge";

const meta: Meta<typeof NetworkBadge> = {
	title: "Wallet/NetworkBadge",
	component: NetworkBadge,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		network: {
			control: "select",
			options: ["mainnet", "testnet"],
			description: "The network type to display",
		},
		className: { control: "text" },
	},
};

export default meta;
type Story = StoryObj<typeof NetworkBadge>;

export const Mainnet: Story = {
	args: {
		network: "mainnet",
	},
};

export const Testnet: Story = {
	args: {
		network: "testnet",
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex gap-2">
			<NetworkBadge network="mainnet" />
			<NetworkBadge network="testnet" />
		</div>
	),
};
