"use client";

import { Button } from "@/components/ui/button";
import { type UseRecoveryReturn } from "@/hooks/useRecovery";

interface InitiateRecoveryCTAProps {
	recovery: UseRecoveryReturn;
}

/**
 * CTA stub for initiating wallet recovery.
 * Renders different UI based on the current recovery state.
 */
export function InitiateRecoveryCTA({ recovery }: InitiateRecoveryCTAProps) {
	const {
		state,
		errorMessage,
		initiateRecovery,
		confirmRecovery,
		cancelRecovery,
		resetRecovery,
	} = recovery;

	if (state === "success") {
		return (
			<div
				role="status"
				aria-live="polite"
				className="rounded-xl border border-green-200 bg-green-50 p-6 flex items-start gap-4 dark:bg-green-900/10 dark:border-green-800"
			>
				<div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400 shrink-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="w-5 h-5"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.5 12.75l6 6 9-13.5"
						/>
					</svg>
				</div>
				<div className="flex-1">
					<h3 className="font-semibold text-green-900 dark:text-green-200">
						Recovery initiated
					</h3>
					<p className="text-sm text-green-800 dark:text-green-300 mt-1">
						Your recovery request has been submitted. This process may take up
						to 24 hours. You will be notified once it completes.
					</p>
					<Button
						variant="ghost"
						size="sm"
						className="mt-3 text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
						onClick={resetRecovery}
					>
						Dismiss
					</Button>
				</div>
			</div>
		);
	}

	if (state === "confirming") {
		return (
			<div
				role="dialog"
				aria-modal="false"
				aria-labelledby="recovery-confirm-title"
				className="rounded-xl border border-amber-200 bg-amber-50 p-6 space-y-4 dark:bg-amber-900/10 dark:border-amber-800"
			>
				<div>
					<h3
						id="recovery-confirm-title"
						className="font-semibold text-amber-900 dark:text-amber-200"
					>
						Confirm recovery initiation
					</h3>
					<p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
						This will start the wallet recovery process. Recovery operations are
						secure and your private keys will never be exposed. Are you sure you
						want to proceed?
					</p>
				</div>
				<div className="flex gap-3">
					<Button
						onClick={confirmRecovery}
						size="sm"
						className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600"
					>
						Yes, initiate recovery
					</Button>
					<Button variant="outline" size="sm" onClick={cancelRecovery}>
						Cancel
					</Button>
				</div>
			</div>
		);
	}

	if (state === "pending") {
		return (
			<div
				role="status"
				aria-live="polite"
				className="rounded-xl border border-zinc-200 bg-white p-6 flex items-center gap-4 dark:border-zinc-800 dark:bg-zinc-950"
			>
				<svg
					className="w-5 h-5 animate-spin text-zinc-500 shrink-0"
					xmlns="http://www.w3.org/2000/svg"
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
						d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
					/>
				</svg>
				<p className="text-sm text-zinc-600 dark:text-zinc-400">
					Submitting recovery request&hellip;
				</p>
			</div>
		);
	}

	// idle or error state — show the primary CTA
	return (
		<div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4 dark:border-zinc-800 dark:bg-zinc-950">
			<div>
				<h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
					Initiate manual recovery
				</h3>
				<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
					If you believe your wallet requires immediate attention, you can
					manually trigger the recovery process.
				</p>
			</div>

			{state === "error" && errorMessage && (
				<div
					role="alert"
					className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
				>
					{errorMessage}
				</div>
			)}

			<Button onClick={initiateRecovery} disabled={state === "pending"}>
				Initiate recovery
			</Button>
		</div>
	);
}
