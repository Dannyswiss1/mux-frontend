"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { dummyWallets } from "@/mock-data/wallets";
import type { Wallet } from "@/types/wallet";

export interface WalletBalanceState {
	wallet: Wallet | null;
	balance: string | null;
	loading: boolean;
	error: string | null;
	lastUpdated: Date | null;
	refresh: () => void;
}

/** Simulates fetching a wallet's live balance from the backend. */
async function fetchWalletBalance(id: string): Promise<Wallet> {
	// Simulate network latency
	await new Promise((resolve) => setTimeout(resolve, 600));

	const wallet = dummyWallets.find((w) => w.id === id);
	if (!wallet) {
		throw new Error(`Wallet ${id} not found`);
	}

	// Simulate a live balance with minor fluctuation for demo purposes
	const base = Number.parseFloat(
		(wallet.balance ?? "0").replace(/[^0-9.]/g, ""),
	);
	const jitter = (Math.random() - 0.5) * 2; // ±1 XLM
	const live = Math.max(0, base + jitter).toFixed(2);
	return { ...wallet, balance: `${live} XLM` };
}

/**
 * Polls the live balance for a wallet at the given interval.
 * @param id - Wallet ID to fetch
 * @param intervalMs - Polling interval in milliseconds (default: 30 000)
 */
export function useWalletBalance(
	id: string | null,
	intervalMs = 30_000,
): WalletBalanceState {
	const [wallet, setWallet] = useState<Wallet | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const fetch = useCallback(async () => {
		if (!id) return;
		setLoading(true);
		setError(null);
		try {
			const data = await fetchWalletBalance(id);
			setWallet(data);
			setLastUpdated(new Date());
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load balance");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		if (!id) return;

		fetch();

		timerRef.current = setInterval(fetch, intervalMs);

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [id, intervalMs, fetch]);

	return {
		wallet,
		balance: wallet?.balance ?? null,
		loading,
		error,
		lastUpdated,
		refresh: fetch,
	};
}
