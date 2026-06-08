"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { WalletNetwork } from "@/types/wallet";

const STORAGE_KEY = "mux_network";
const VALID: WalletNetwork[] = ["mainnet", "testnet"];
const DEFAULT: WalletNetwork = "mainnet";

function readStored(): WalletNetwork {
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		if (v && (VALID as string[]).includes(v)) return v as WalletNetwork;
	} catch {}
	return DEFAULT;
}

interface NetworkContextValue {
	network: WalletNetwork;
	setNetwork: (n: WalletNetwork) => void;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
	const [network, setNetworkState] = useState<WalletNetwork>(DEFAULT);

	useEffect(() => {
		setNetworkState(readStored());
	}, []);

	function setNetwork(n: WalletNetwork) {
		setNetworkState(n);
		try {
			localStorage.setItem(STORAGE_KEY, n);
		} catch {}
	}

	return (
		<NetworkContext.Provider value={{ network, setNetwork }}>
			{children}
		</NetworkContext.Provider>
	);
}

export function useNetwork(): NetworkContextValue {
	const ctx = useContext(NetworkContext);
	if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
	return ctx;
}
