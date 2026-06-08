"use client";

import { useEffect } from "react";

interface GlobalErrorBoundaryProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export function GlobalErrorBoundary({
	error,
	reset,
}: GlobalErrorBoundaryProps) {
	useEffect(() => {
		// Log to an error reporting service in production
		console.error("[GlobalErrorBoundary]", error);
	}, [error]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 text-center">
			<div className="flex w-full max-w-md flex-col items-center gap-6">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
					<svg
						className="h-10 w-10 text-destructive"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
						/>
					</svg>
				</div>

				<div className="flex flex-col gap-2">
					<h1 className="text-2xl font-semibold text-foreground">
						Something went wrong
					</h1>
					<p className="text-muted-foreground">
						An unexpected error occurred. You can try again or return to the
						dashboard.
					</p>
					{error.digest && (
						<p className="font-mono text-xs text-muted-foreground">
							Error ID: {error.digest}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-3 sm:flex-row">
					<button
						type="button"
						onClick={reset}
						className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						Try again
					</button>
					<a
						href="/"
						className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						Go home
					</a>
				</div>
			</div>
		</div>
	);
}
