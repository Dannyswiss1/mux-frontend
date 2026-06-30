"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, Suspense, useEffect, useState } from "react";
import { AuthLoadingSkeleton } from "@/components/layouts/AuthLoadingSkeleton";
import { useAuth } from "@/context/AuthContext";
import { ToastContainer, useToast } from "@/components/ui/Toast";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LoginFormState {
	email: string;
	password: string;
}

interface FieldErrors {
	email?: string;
	password?: string;
}

/** Tracks which fields the user has interacted with (blurred or submitted). */
interface TouchedFields {
	email: boolean;
	password: boolean;
}

// ---------------------------------------------------------------------------
// API call — #325: wire to backend via POST /api/auth/login
// ---------------------------------------------------------------------------

/**
 * Sends login credentials to the backend and returns the authenticated user.
 *
 * @param email - The user's email address.
 * @param password - The user's password (plaintext; HTTPS in production).
 * @returns The authenticated user record `{ name, email, role }`.
 * @throws {Error} When the response is not OK or the user payload is missing.
 */
async function authenticateUser(
	email: string,
	password: string,
): Promise<{ name: string; email: string; role: string }> {
	const res = await fetch("/api/auth/login", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	const data = await res.json().catch(() => ({}));

	if (!res.ok) {
		throw new Error(
			(data as { error?: string }).error ||
				"Sign in failed. Please check your credentials and try again.",
		);
	}

	const user = (
		data as { user?: { name: string; email: string; role: string } }
	).user;
	if (!user) {
		throw new Error("Unexpected response from authentication server.");
	}

	return user;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// #327: Styled error card component
// ---------------------------------------------------------------------------

/**
 * Inline error banner displayed below the page header when a submit error occurs.
 *
 * @param message - The error text to display.
 * @param onDismiss - Callback invoked when the user clicks the dismiss (×) button.
 */
function LoginErrorCard({
	message,
	onDismiss,
}: {
	message: string;
	onDismiss: () => void;
}) {
	return (
		<div
			role="alert"
			className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
			data-testid="login-error"
		>
			<svg
				className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={2}
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
				/>
			</svg>
			<span className="flex-1">{message}</span>
			<button
				type="button"
				onClick={onDismiss}
				aria-label="Dismiss error"
				className="text-red-400 hover:text-red-600"
			>
				<svg
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	);
}

// ---------------------------------------------------------------------------
// #326: Empty/welcome state shown before the user starts typing
// ---------------------------------------------------------------------------

/**
 * Informational banner shown when the login form is in its pristine (untouched) state.
 * Disappears as soon as the user begins entering credentials or a submit error appears.
 */
function LoginWelcomeHint() {
	return (
		<div
			className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700"
			data-testid="login-empty-state"
		>
			<p className="font-medium">Welcome to Mux Protocol</p>
			<p className="mt-0.5 text-blue-600">
				Enter your credentials to access your developer console.
			</p>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Page content
// ---------------------------------------------------------------------------

function LoginPageContent() {
	const { isAuthenticated, isLoading, signIn } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toasts, addToast, dismissToast } = useToast();

	const [fields, setFields] = useState<LoginFormState>({
		email: "",
		password: "",
	});
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	/** Tracks which fields have been touched (blurred or form submitted). */
	const [touched, setTouched] = useState<TouchedFields>({
		email: false,
		password: false,
	});
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	/** Controls whether the password field shows plain text. */
	const [showPassword, setShowPassword] = useState(false);

	const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

	// Derived: true when the user hasn't interacted with the form yet (#326)
	const isPristine = !fields.email && !fields.password;

	// Redirect already-authenticated users away from the login page
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.replace(callbackUrl);
		}
	}, [isAuthenticated, isLoading, callbackUrl, router]);

	/**
	 * Returns a border/background class for a field.
	 *  - Red when touched and has an error
	 *  - Green when touched, no error, and has a value (field was corrected)
	 *  - Default gray otherwise
	 */
	function fieldBorderClass(name: keyof FieldErrors): string {
		if (!touched[name]) return "border-gray-300 bg-white";
		if (fieldErrors[name]) return "border-red-400 bg-red-50 focus:ring-red-400";
		if (fields[name]) return "border-green-400 bg-white focus:ring-green-400";
		return "border-gray-300 bg-white";
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		const key = name as keyof LoginFormState;
		const updated = { ...fields, [key]: value };
		setFields(updated);
		setSubmitError(null);

		// Re-validate immediately if the field has already been touched, so a
		// previously-errored field turns green as soon as the user fixes it.
		if (touched[key]) {
			const errors = validate(updated);
			setFieldErrors((prev) => ({ ...prev, [key]: errors[key] }));
		}
	}

	/** Validate the field when focus leaves it (blur validation). */
	function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
		const { name } = e.target;
		const key = name as keyof LoginFormState;
		setTouched((prev) => ({ ...prev, [key]: true }));
		const errors = validate(fields);
		setFieldErrors((prev) => ({ ...prev, [key]: errors[key] }));
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setSubmitError(null);

		// Mark all fields as touched on submit so errors appear immediately.
		setTouched({ email: true, password: true });

		const errors = validate(fields);
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}

		setIsSubmitting(true);
		try {
			const user = await authenticateUser(fields.email, fields.password);
			signIn(user);
			addToast({
				type: "success",
				message: "Signed in successfully!",
				description: `Welcome back, ${user.name}.`,
			});
			router.replace(callbackUrl);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: "Sign in failed. Please check your credentials and try again.";
			setSubmitError(message);
			addToast({
				type: "error",
				message: "Sign in failed",
				description: message,
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	// #328: While auth state is being rehydrated, show the AuthLoadingSkeleton
	// instead of a bare spinner so the page does not flash.
	if (isLoading) {
		return <AuthLoadingSkeleton />;
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-3 py-4 sm:px-4 md:px-0">
			<ToastContainer
				toasts={toasts}
				onDismiss={dismissToast}
				position="bottom-right"
				// Responsive position: use "top-right" on md and up
				className="md:fixed md:top-6 md:right-6"
			/>
			<div className="w-full max-w-md">
				{/* Logo / brand */}
				<div className="mb-6 text-center sm:mb-8">
					{/* Responsive logo size: smaller on mobile (h-10 w-10), standard on desktop (h-12 w-12) */}
					<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 sm:mb-4 sm:h-12 sm:w-12 sm:rounded-xl">
						<svg
							className="h-5 w-5 text-white sm:h-6 sm:w-6"
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
					{/* Responsive heading: text-xl on mobile, text-2xl on desktop */}
					<h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
						Mux Protocol
					</h1>
					<p className="mt-1 text-xs text-gray-500 sm:text-sm">
						Sign in to your developer console
					</p>
				</div>

				{/* Login card */}
				<div className="rounded-xl border border-gray-200 bg-white px-4 py-6 shadow-sm sm:rounded-2xl sm:px-8 sm:py-10">
					<h2 className="mb-4 text-base font-semibold text-gray-900 sm:mb-6 sm:text-lg">Sign in</h2>

					{/* #326: Empty/welcome state — shown before the user types anything */}
					{isPristine && !submitError && <LoginWelcomeHint />}

					{/* #327: Styled error card for submit errors */}
					{submitError && (
						<LoginErrorCard
							message={submitError}
							onDismiss={() => setSubmitError(null)}
						/>
					)}

					<form
						onSubmit={handleSubmit}
						noValidate
						aria-label="Sign in form"
						data-testid="login-form"
					>
						{/* Email field */}
						<div className="mb-3 sm:mb-4">
							<label
								htmlFor="email"
								className="mb-1 block text-xs font-medium text-gray-700 sm:mb-1.5 sm:text-sm"
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
								onBlur={handleBlur}
								disabled={isSubmitting}
								aria-invalid={!!fieldErrors.email}
								aria-describedby={fieldErrors.email ? "email-error" : undefined}
								className={[
									"block w-full rounded-lg border px-2.5 py-2 text-xs text-gray-900 placeholder-gray-400 sm:px-3 sm:py-2.5 sm:text-sm",
									"focus:outline-none focus:ring-2 focus:ring-offset-0",
									"disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
									fieldBorderClass("email"),
								].join(" ")}
								placeholder="you@example.com"
							/>
							{fieldErrors.email && (
								<p
									id="email-error"
									role="alert"
									className="mt-1 text-xs text-red-600"
									data-testid="email-error"
								>
									{fieldErrors.email}
								</p>
							)}
						</div>

						{/* Password field */}
						<div className="mb-4 sm:mb-6">
							<label
								htmlFor="password"
								className="mb-1 block text-xs font-medium text-gray-700 sm:mb-1.5 sm:text-sm"
							>
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									value={fields.password}
									onChange={handleChange}
									onBlur={handleBlur}
									disabled={isSubmitting}
									aria-invalid={!!fieldErrors.password}
									aria-describedby={
										fieldErrors.password ? "password-error" : undefined
									}
									className={[
										"block w-full rounded-lg border px-2.5 py-2 pr-9 text-xs text-gray-900 placeholder-gray-400 sm:px-3 sm:py-2.5 sm:pr-10 sm:text-sm",
										"focus:outline-none focus:ring-2 focus:ring-offset-0",
										"disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
										fieldBorderClass("password"),
									].join(" ")}
									placeholder="••••••••"
								/>
								{/* Password visibility toggle */}
								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									aria-pressed={showPassword}
									tabIndex={0}
									disabled={isSubmitting}
									className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed sm:pr-3"
									data-testid="password-toggle"
								>
									{showPassword ? (
										/* Eye-off icon */
										<svg
											className="h-3.5 w-3.5 sm:h-4 sm:w-4"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
											/>
										</svg>
									) : (
										/* Eye icon */
										<svg
											className="h-3.5 w-3.5 sm:h-4 sm:w-4"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									)}
								</button>
							</div>
							{fieldErrors.password && (
								<p
									id="password-error"
									role="alert"
									className="mt-1 text-xs text-red-600"
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
								"flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-colors sm:px-4 sm:py-2.5 sm:text-sm",
								"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
								"disabled:cursor-not-allowed disabled:opacity-60",
								isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700",
							].join(" ")}
							data-testid="login-submit"
						>
							{isSubmitting ? (
								<>
									<svg
										className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4"
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
				<p className="mt-4 text-center text-xs text-gray-400 sm:mt-6">
					Mux Protocol developer console — internal use only
				</p>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<AuthLoadingSkeleton />}>
			<LoginPageContent />
		</Suspense>
	);
}
