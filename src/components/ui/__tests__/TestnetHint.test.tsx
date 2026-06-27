import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { FRIENDBOT_DOCS_URL, FRIENDBOT_URL } from "@/utils/friendbot";
import { TestnetHint } from "../TestnetHint";

describe("TestnetHint component", () => {
	describe("default variant", () => {
		it("should render with title and description", () => {
			render(<TestnetHint />);

			expect(
				screen.getByText(/You're on Stellar Testnet/i),
			).toBeInTheDocument();
			expect(
				screen.getByText(/This is a test network for development/i),
			).toBeInTheDocument();
		});

		it("should render Friendbot link", () => {
			render(<TestnetHint />);

			const friendbotLink = screen.getByRole("link", {
				name: /Open Friendbot/i,
			});
			expect(friendbotLink).toHaveAttribute("href", FRIENDBOT_URL);
			expect(friendbotLink).toHaveAttribute("target", "_blank");
			expect(friendbotLink).toHaveAttribute("rel", "noopener noreferrer");
		});

		it("should render Learn More link", () => {
			render(<TestnetHint />);

			const learnMoreLink = screen.getByRole("link", { name: /Learn More/i });
			expect(learnMoreLink).toHaveAttribute("href", FRIENDBOT_DOCS_URL);
			expect(learnMoreLink).toHaveAttribute("target", "_blank");
			expect(learnMoreLink).toHaveAttribute("rel", "noopener noreferrer");
		});

		it("should render dismiss button by default", () => {
			render(<TestnetHint />);

			const dismissButton = screen.getByRole("button", {
				name: /Dismiss testnet hint/i,
			});
			expect(dismissButton).toBeInTheDocument();
		});

		it("should hide component when dismissed", () => {
			const { container } = render(<TestnetHint />);

			const dismissButton = screen.getByRole("button", {
				name: /Dismiss testnet hint/i,
			});
			fireEvent.click(dismissButton);

			expect(container.firstChild).toBeNull();
		});

		it("should not render dismiss button when dismissible is false", () => {
			render(<TestnetHint dismissible={false} />);

			const dismissButton = screen.queryByRole("button", {
				name: /Dismiss testnet hint/i,
			});
			expect(dismissButton).not.toBeInTheDocument();
		});

		it("should apply custom className", () => {
			const { container } = render(<TestnetHint className="custom-class" />);

			const hintDiv = container.querySelector(".custom-class");
			expect(hintDiv).toBeInTheDocument();
		});

		it("should have proper accessibility attributes", () => {
			render(<TestnetHint />);

			const dismissButton = screen.getByRole("button", {
				name: /Dismiss testnet hint/i,
			});
			expect(dismissButton).toHaveAttribute("aria-label");
			expect(dismissButton).toHaveAttribute("type", "button");
		});
	});

	describe("compact variant", () => {
		it("should render compact version", () => {
			render(<TestnetHint variant="compact" />);

			expect(screen.getByText(/You're on testnet/i)).toBeInTheDocument();
		});

		it("should render Friendbot link in compact variant", () => {
			render(<TestnetHint variant="compact" />);

			const friendbotLink = screen.getByRole("link", {
				name: /Fund with Friendbot/i,
			});
			expect(friendbotLink).toHaveAttribute("href", FRIENDBOT_URL);
		});

		it("should render dismiss button in compact variant", () => {
			render(<TestnetHint variant="compact" />);

			const dismissButton = screen.getByRole("button", {
				name: /Dismiss testnet hint/i,
			});
			expect(dismissButton).toBeInTheDocument();
		});

		it("should hide component when dismissed in compact variant", () => {
			const { container } = render(<TestnetHint variant="compact" />);

			const dismissButton = screen.getByRole("button", {
				name: /Dismiss testnet hint/i,
			});
			fireEvent.click(dismissButton);

			expect(container.firstChild).toBeNull();
		});

		it("should not render dismiss button when dismissible is false in compact variant", () => {
			render(<TestnetHint variant="compact" dismissible={false} />);

			const dismissButton = screen.queryByRole("button", {
				name: /Dismiss testnet hint/i,
			});
			expect(dismissButton).not.toBeInTheDocument();
		});

		it("should apply custom className in compact variant", () => {
			const { container } = render(
				<TestnetHint variant="compact" className="custom-class" />,
			);

			const hintDiv = container.querySelector(".custom-class");
			expect(hintDiv).toBeInTheDocument();
		});
	});

	describe("state management", () => {
		it("should maintain dismissed state independently per instance", () => {
			const { rerender } = render(
				<>
					<TestnetHint data-testid="hint-1" />
					<TestnetHint data-testid="hint-2" />
				</>,
			);

			const dismissButtons = screen.getAllByRole("button", {
				name: /Dismiss testnet hint/i,
			});
			fireEvent.click(dismissButtons[0]);

			// First hint should be dismissed, second should still be visible
			expect(
				screen.getByText(/You're on Stellar Testnet/i),
			).toBeInTheDocument();
		});

		it("should not persist dismissed state across re-renders", () => {
			const { rerender } = render(<TestnetHint />);

			const dismissButton = screen.getByRole("button", {
				name: /Dismiss testnet hint/i,
			});
			fireEvent.click(dismissButton);

			expect(
				screen.queryByText(/You're on Stellar Testnet/i),
			).not.toBeInTheDocument();

			// Re-render should show the hint again (state is local)
			rerender(<TestnetHint />);
			expect(
				screen.getByText(/You're on Stellar Testnet/i),
			).toBeInTheDocument();
		});
	});

	describe("dark mode", () => {
		it("should have dark mode classes", () => {
			const { container } = render(<TestnetHint />);

			const hintDiv = container.querySelector("div");
			expect(hintDiv?.className).toContain("dark:");
		});
	});

	describe("external links", () => {
		it("should have proper security attributes on external links", () => {
			render(<TestnetHint />);

			const links = screen.getAllByRole("link");
			links.forEach((link) => {
				if (link.getAttribute("href")?.startsWith("http")) {
					expect(link).toHaveAttribute("target", "_blank");
					expect(link).toHaveAttribute("rel", "noopener noreferrer");
				}
			});
		});
	});
});
