"use client";

import { useCallback, useState } from "react";

function getStoredValue<T>(
	key: string,
	initialValue: T,
	isStorageAvailable: boolean,
): T {
	if (typeof window === "undefined" || !isStorageAvailable) {
		return initialValue;
	}

	try {
		const raw = window.localStorage.getItem(key);
		if (raw !== null) {
			return JSON.parse(raw) as T;
		}
	} catch {
		return initialValue;
	}

	return initialValue;
}

function checkStorageAvailability() {
	if (typeof window === "undefined") {
		return false;
	}

	try {
		const testKey = "__mux_storage_test__";
		window.localStorage.setItem(testKey, testKey);
		window.localStorage.removeItem(testKey);
		return true;
	} catch {
		return false;
	}
}

export interface LocalStorageState<T> {
	value: T;
	setValue: (next: T) => void;
	storageAvailable: boolean;
	persist: () => boolean;
}

export function useLocalStorageState<T>(
	key: string,
	initialValue: T,
): LocalStorageState<T> {
	const [storageAvailable] = useState<boolean>(() =>
		checkStorageAvailability(),
	);
	const [value, setValue] = useState<T>(() =>
		getStoredValue(key, initialValue, storageAvailable),
	);

	const persist = useCallback(() => {
		if (typeof window === "undefined" || !storageAvailable) {
			return false;
		}

		try {
			window.localStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch {
			return false;
		}
	}, [key, storageAvailable, value]);

	return { value, setValue, storageAvailable, persist };
}
