"use client";
import React from "react";

export default function RequestsToday() {
	const [count, setCount] = React.useState<number | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		let mounted = true;
		setLoading(true);
		fetch("/api/requests/today")
			.then((res) => {
				if (!res.ok) throw new Error(`Request failed: ${res.status}`);
				return res.json();
			})
			.then((data) => {
				if (!mounted) return;
				if (typeof data?.count === "number") setCount(data.count);
				else setError("invalid response");
			})
			.catch((err) => {
				if (!mounted) return;
				setError(err?.message || "fetch error");
			})
			.finally(() => {
				if (!mounted) return;
				setLoading(false);
			});
		return () => {
			mounted = false;
		};
	}, []);

	if (loading) return <div>Loading API requests today…</div>;
	if (error) return <div>Error loading requests: {error}</div>;
	return (
		<div className="rounded-lg border p-4">
			<h3 className="text-sm text-zinc-500">API requests today</h3>
			<p className="mt-1 text-2xl font-semibold">{count ?? "—"}</p>
		</div>
	);
}
