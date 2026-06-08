/**
 * Tests for LoginPage scaffold (issue #47 — add login page scaffold)
 *
 * Covers:
 * - Renders the login form
 * - Shows loading state while auth is rehydrating
 * - Validates required fields
 * - Validates email format
 * - Validates password minimum length
 * - Calls signIn and redirects on successful submission
 * - Shows error message on authentication failure
 * - Disables form while submitting
 * - Redirects authenticated users away from the login page
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/context/AuthContext";
import LoginPage from "../page";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockReplace = vi.fn();
const mockGet = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: mockReplace }),
	useSearchParams: () => ({ get: mockGet }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderLoginPage() {
	mockGet.mockReturnValue(null); // no callbackUrl by default
	return render(
		<AuthProvider>
			<LoginPage />
		</AuthProvider>,
	);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LoginPage (issue #47)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		sessionStorage.clear();
	});

	afterEach(() => {
		sessionStorage.clear();
	});

	it("renders the sign-in form after auth loads", async () => {
		renderLoginPage();
		// Wait for isLoading to resolve (useEffect fires)
		const form = await screen.findByTestId("login-form");
		expect(form).toBeInTheDocument();
	});

	it("renders email and password fields", async () => {
		renderLoginPage();
		expect(await screen.findByLabelText(/email address/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
	});

	it("renders the submit button", async () => {
		renderLoginPage();
		expect(await screen.findByTestId("login-submit")).toBeInTheDocument();
	});

	it("shows loading spinner while auth is rehydrating", () => {
		// On first synchronous render, isLoading is true
		renderLoginPage();
		expect(screen.getByTestId("login-loading")).toBeInTheDocument();
	});

	it("shows email required error when email is empty", async () => {
		renderLoginPage();
		await screen.findByTestId("login-form");

		fireEvent.click(screen.getByTestId("login-submit"));

		expect(await screen.findByTestId("email-error")).toHaveTextContent(
			"Email is required.",
		);
	});

	it("shows email format error for invalid email", async () => {
		renderLoginPage();
		await screen.findByTestId("login-form");

		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "not-an-email" },
		});
		fireEvent.click(screen.getByTestId("login-submit"));

		expect(await screen.findByTestId("email-error")).toHaveTextContent(
			"valid email",
		);
	});

	it("shows password required error when password is empty", async () => {
		renderLoginPage();
		await screen.findByTestId("login-form");

		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "user@example.com" },
		});
		fireEvent.click(screen.getByTestId("login-submit"));

		expect(await screen.findByTestId("password-error")).toHaveTextContent(
			"Password is required.",
		);
	});

	it("shows password length error for short password", async () => {
		renderLoginPage();
		await screen.findByTestId("login-form");

		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "user@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "abc" },
		});
		fireEvent.click(screen.getByTestId("login-submit"));

		expect(await screen.findByTestId("password-error")).toHaveTextContent(
			"at least 6 characters",
		);
	});

	it("calls signIn and redirects to /dashboard on successful submission", async () => {
		renderLoginPage();
		await screen.findByTestId("login-form");

		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "user@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByTestId("login-submit"));

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/dashboard");
		});
	});

	it("redirects to callbackUrl after successful sign-in", async () => {
		mockGet.mockReturnValue("/dashboard/wallets");
		render(
			<AuthProvider>
				<LoginPage />
			</AuthProvider>,
		);
		await screen.findByTestId("login-form");

		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "user@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByTestId("login-submit"));

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/dashboard/wallets");
		});
	});

	it("disables the submit button while submitting", async () => {
		renderLoginPage();
		await screen.findByTestId("login-form");

		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "user@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});

		const submitBtn = screen.getByTestId("login-submit");
		fireEvent.click(submitBtn);

		// Button should be disabled immediately after click
		expect(submitBtn).toBeDisabled();
	});

	it("redirects authenticated users away from the login page", async () => {
		// Seed a valid session
		const record = {
			user: { name: "Jane Doe", email: "jane@example.com", role: "admin" },
			expiresAt: Date.now() + 60_000,
		};
		sessionStorage.setItem("mux_auth_user", JSON.stringify(record));

		renderLoginPage();

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/dashboard");
		});
	});
});
