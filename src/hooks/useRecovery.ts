"use client";

import { useCallback, useEffect, useState } from "react";

export type RecoveryState =
	| "loading"
	| "idle"
	| "confirming"
	| "pending"
	| "success"
	| "error";

export interface UseRecoveryReturn {
	state: RecoveryState;
	errorMessage: string | null;
	initiateRecovery: () => void;
	confirmRecovery: () => Promise<void>;
	cancelRecovery: () => void;
	resetRecovery: () => void;
}

/**
 * Stub hook for initiating wallet recovery.
 * Manages the recovery flow state machine:
 *   loading → idle → confirming → pending → success | error
 *
 * Starts in "loading" to simulate fetching initial recovery status from the
 * backend. Replace the bootstrap effect with a real API call when ready.
 *
 * The `confirmRecovery` function is a stub that simulates an async API call.
 * Replace the body with a real API integration when the backend is ready.
 */
export function useRecovery(): UseRecoveryReturn {
	// Start in loading so the page shows a skeleton while status is fetched.
	const [state, setState] = useState<RecoveryState>("loading");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Simulate fetching initial recovery status from the backend.
	// TODO: replace with real API call, e.g. const data = await recoveryApi.getStatus()
	useEffect(() => {
		let cancelled = false;
		const bootstrap = async () => {
			try {
				await new Promise<void>((resolve) => setTimeout(resolve, 1200));
				if (!cancelled) setState("idle");
			} catch {
				if (!cancelled) {
					setErrorMessage("Failed to load recovery status.");
					setState("error");
				}
			}
		};
		bootstrap();
		return () => {
			cancelled = true;
		};
	}, []);

	const initiateRecovery = useCallback(() => {
		if (state !== "idle" && state !== "error") return;
		setErrorMessage(null);
		setState("confirming");
	}, [state]);

	const confirmRecovery = useCallback(async () => {
		if (state !== "confirming") return;
		setState("pending");
		try {
			// TODO: replace with real API call, e.g. await recoveryApi.initiate()
			await new Promise<void>((resolve) => setTimeout(resolve, 1500));
			setState("success");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "An unexpected error occurred.";
			setErrorMessage(message);
			setState("error");
		}
	}, [state]);

	const cancelRecovery = useCallback(() => {
		if (state !== "confirming") return;
		setState("idle");
		setErrorMessage(null);
	}, [state]);

	const resetRecovery = useCallback(() => {
		setState("idle");
		setErrorMessage(null);
	}, []);

	return {
		state,
		errorMessage,
		initiateRecovery,
		confirmRecovery,
		cancelRecovery,
		resetRecovery,
	};
}
