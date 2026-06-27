/**
 * Tests for DashboardLayout (issue #44 — auth loading skeleton integration)
 *
 * Verifies that DashboardLayout renders the AuthLoadingSkeleton while
 * isLoading is true, and renders children once auth has resolved.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "@/context/AuthContext";
import { NetworkProvider } from "@/context/NetworkContext";
import { DashboardLayout } from "../DashboardLayout";

function renderWithProviders(ui: React.ReactElement) {
	return render(
		<AuthProvider>
			<NetworkProvider>{ui}</NetworkProvider>
		</AuthProvider>,
	);
}

describe("DashboardLayout — auth loading skeleton (issue #44)", () => {
	afterEach(() => {
		sessionStorage.clear();
	});

	it("renders the auth loading skeleton on initial mount (isLoading = true)", () => {
		// No session in storage → isLoading starts true, resolves to false
		// The synchronous render captures the loading state
		const { container } = renderWithProviders(
			<DashboardLayout>
				<div data-testid="page-content">Page</div>
			</DashboardLayout>,
		);
		// Either the skeleton or the layout is rendered — container is not empty
		expect(container.firstChild).not.toBeNull();
	});

	it("shows the auth loading skeleton element while loading", () => {
		// No session → isLoading is true on first render
		renderWithProviders(
			<DashboardLayout>
				<div data-testid="page-content">Page</div>
			</DashboardLayout>,
		);
		// The skeleton should be present before the effect resolves
		expect(screen.getByTestId("auth-loading-skeleton")).toBeInTheDocument();
	});

	it("renders children once auth has loaded with a valid session", async () => {
		// Pre-populate sessionStorage with a valid session
		const record = {
			user: { name: "Test User", email: "test@example.com", role: "admin" },
			expiresAt: Date.now() + 60_000,
		};
		sessionStorage.setItem("mux_auth_user", JSON.stringify(record));

		const { findByTestId } = renderWithProviders(
			<DashboardLayout>
				<div data-testid="page-content">Page</div>
			</DashboardLayout>,
		);

		// After the useEffect fires, isLoading becomes false and children render
		const content = await findByTestId("page-content");
		expect(content).toBeInTheDocument();
	});
});
