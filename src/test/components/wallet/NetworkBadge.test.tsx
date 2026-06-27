import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";

describe("NetworkBadge", () => {
	it("renders 'Testnet' label for testnet network", () => {
		render(<NetworkBadge network="testnet" />);
		expect(screen.getByText("Testnet")).toBeInTheDocument();
	});

	it("renders 'Mainnet' label for mainnet network", () => {
		render(<NetworkBadge network="mainnet" />);
		expect(screen.getByText("Mainnet")).toBeInTheDocument();
	});

	it("applies testnet-specific amber color classes", () => {
		const { container } = render(<NetworkBadge network="testnet" />);
		const badge = container.firstChild as HTMLElement;
		expect(badge.className).toMatch(/amber/);
	});

	it("applies mainnet-specific blue color classes", () => {
		const { container } = render(<NetworkBadge network="mainnet" />);
		const badge = container.firstChild as HTMLElement;
		expect(badge.className).toMatch(/blue/);
	});

	it("accepts and applies an additional className", () => {
		const { container } = render(
			<NetworkBadge network="mainnet" className="custom-class" />,
		);
		const badge = container.firstChild as HTMLElement;
		expect(badge.className).toContain("custom-class");
	});

	it("renders as a span element (Badge default)", () => {
		const { container } = render(<NetworkBadge network="mainnet" />);
		expect(container.querySelector("span")).toBeInTheDocument();
	});
});
