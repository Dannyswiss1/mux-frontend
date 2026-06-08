"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * LoginPage — scaffold for the Mux Protocol authentication flow (issue #47).
 *
 * Responsibilities:
 * - Render a login form (email + password fields)
 * - On submit, call `signIn` from AuthContext with the resolved user record
 * - Redirect to `callbackUrl` (or `/dashboard`) after a successful sign-in
 * - Redirect already-authenticated users away from this page immediately
 * - Show inline validation and error feedback
 * - Handle the loading state while auth is being rehydrated
 *
 * NOTE: This is a scaffold. The `authenticateUser` helper below is a
 * placeholder that accepts any non-empty credentials and returns a mock
 * user. Replace it with a real API call when the backend auth endpoint
 * is available (see docs/auth-local-setup.md).
 */

interface LoginFormState {
	email: string;
	password: string;
}

interface FieldErrors {
	email?: string;
	password?: string;
}

/**
 * Placeholder authentication function.
 * Replace with a real API call (e.g. POST /api/auth/login) once the
 * backend endpoint is available.
 */
async function authenticateUser(
	email: string,
	_password: string,
): Promise<{ name: string; email: string; role: string }> {
	// Simulate network latency
	await new Promise((resolve) => setTimeout(resolve, 400));

	// Derive a display name from the email prefix
	const namePart = email.split("@")[0] ?? "User";
	const name = namePart
		.split(/[._-]/)
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join(" ");

	return { name, email, role: "developer" };
}

function validate(fields: LoginFormState): FieldErrors {
	const errors: FieldErrors = {};
	if (!fields.email.trim()) {
		errors.email = "Email is required.";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
		errors.email = "Enter a valid email address.";
	}
	if (!fields.password) {
		errors.password = "Password is required.";
	} else if (fields.password.length < 6) {
		errors.password = "Password must be at least 6 characters.";
	}
	return errors;
}

export default function LoginPage() {
	const { isAuthenticated, isLoading, signIn } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [fields, setFields] = useState<LoginFormState>({
		email: "",
		password: "",
	});
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

	// Redirect already-authenticated users away from the login page
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.replace(callbackUrl);
		}
	}, [isAuthenticated, isLoading, callbackUrl, router]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFields((prev) => ({ ...prev, [name]: value }));
		// Clear the field error as the user types
		if (fieldErrors[name as keyof FieldErrors]) {
			setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
		}
		setSubmitError(null);
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setSubmitError(null);

		const errors = validate(fields);
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}

		setIsSubmitting(true);
		try {
			const user = await authenticateUser(fields.email, fields.password);
			signIn(user);
			router.replace(callbackUrl);
		} catch {
			setSubmitError(
				"Sign in failed. Please check your credentials and try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	// While auth state is being rehydrated, show a minimal loading indicator
	// so the page doesn't flash the form for already-authenticated users.
	if (isLoading) {
		return (
			<div
				className="flex min-h-screen items-center justify-center bg-gray-50"
				aria-busy="true"
				aria-label="Loading"
				data-testid="login-loading"
			>
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md">
				{/* Logo / brand */}
				<div className="mb-8 text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
						<svg
							className="h-6 w-6 text-white"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
							/>
						</svg>
					</div>
					<h1 className="text-2xl font-bold tracking-tight text-gray-900">
						Mux Protocol
					</h1>
					<p className="mt-1 text-sm text-gray-500">
						Sign in to your developer console
					</p>
				</div>

				{/* Login card */}
				<div className="rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-sm">
					<h2 className="mb-6 text-lg font-semibold text-gray-900">Sign in</h2>

					{/* Global submit error */}
					{submitError && (
						<div
							role="alert"
							className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
							data-testid="login-error"
						>
							{submitError}
						</div>
					)}

					<form
						onSubmit={handleSubmit}
						noValidate
						aria-label="Sign in form"
						data-testid="login-form"
					>
						{/* Email field */}
						<div className="mb-4">
							<label
								htmlFor="email"
								className="mb-1.5 block text-sm font-medium text-gray-700"
							>
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								value={fields.email}
								onChange={handleChange}
								disabled={isSubmitting}
								aria-invalid={!!fieldErrors.email}
								aria-describedby={fieldErrors.email ? "email-error" : undefined}
								className={[
									"block w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400",
									"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
									"disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
									fieldErrors.email
										? "border-red-400 bg-red-50 focus:ring-red-400"
										: "border-gray-300 bg-white",
								].join(" ")}
								placeholder="you@example.com"
							/>
							{fieldErrors.email && (
								<p
									id="email-error"
									role="alert"
									className="mt-1.5 text-xs text-red-600"
									data-testid="email-error"
								>
									{fieldErrors.email}
								</p>
							)}
						</div>

						{/* Password field */}
						<div className="mb-6">
							<label
								htmlFor="password"
								className="mb-1.5 block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								value={fields.password}
								onChange={handleChange}
								disabled={isSubmitting}
								aria-invalid={!!fieldErrors.password}
								aria-describedby={
									fieldErrors.password ? "password-error" : undefined
								}
								className={[
									"block w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400",
									"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
									"disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
									fieldErrors.password
										? "border-red-400 bg-red-50 focus:ring-red-400"
										: "border-gray-300 bg-white",
								].join(" ")}
								placeholder="••••••••"
							/>
							{fieldErrors.password && (
								<p
									id="password-error"
									role="alert"
									className="mt-1.5 text-xs text-red-600"
									data-testid="password-error"
								>
									{fieldErrors.password}
								</p>
							)}
						</div>

						{/* Submit button */}
						<button
							type="submit"
							disabled={isSubmitting}
							className={[
								"flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5",
								"text-sm font-semibold text-white transition-colors",
								"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
								"disabled:cursor-not-allowed disabled:opacity-60",
								isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700",
							].join(" ")}
							data-testid="login-submit"
						>
							{isSubmitting ? (
								<>
									<svg
										className="h-4 w-4 animate-spin"
										fill="none"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										/>
									</svg>
									Signing in…
								</>
							) : (
								"Sign in"
							)}
						</button>
					</form>
				</div>

				{/* Footer note */}
				<p className="mt-6 text-center text-xs text-gray-400">
					Mux Protocol developer console — internal use only
				</p>
			</div>
		</div>
	);
}
