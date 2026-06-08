"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchApiKeys } from "@/lib/api";
import type { ApiKey } from "@/mock-data/api-keys";

export function useApiKeys() {
	const [data, setData] = useState<ApiKey[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetchApiKeys();
			setData(res);
		} catch (err: any) {
			setError(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	return {
		data,
		loading,
		error,
		refetch: load,
	};
}
