export interface TransactionVolumePoint {
	date: string; // ISO date string YYYY-MM-DD
	count: number;
	volume: number; // in XLM
}

function seed(n: number) {
	// Simple deterministic pseudo-random
	const x = Math.sin(n + 1) * 10000;
	return x - Math.floor(x);
}

/** Generate daily data for the last 90 days */
function generateDailyData(): TransactionVolumePoint[] {
	const data: TransactionVolumePoint[] = [];
	const today = new Date("2026-05-30");
	for (let i = 89; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(d.getDate() - i);
		const dateStr = d.toISOString().slice(0, 10);
		const r1 = seed(i * 3);
		const r2 = seed(i * 3 + 1);
		// Weekend dip
		const dow = d.getDay();
		const weekendFactor = dow === 0 || dow === 6 ? 0.5 : 1;
		const count = Math.round((20 + r1 * 80) * weekendFactor);
		const volume = Math.round(count * (500 + r2 * 2000) * 100) / 100;
		data.push({ date: dateStr, count, volume });
	}
	return data;
}

export const dailyTransactionVolume: TransactionVolumePoint[] =
	generateDailyData();
