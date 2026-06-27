"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export interface DateRange {
	from: string; // YYYY-MM-DD
	to: string; // YYYY-MM-DD
}

interface Preset {
	label: string;
	days: number;
}

const PRESETS: Preset[] = [
	{ label: "Last 7 days", days: 7 },
	{ label: "Last 14 days", days: 14 },
	{ label: "Last 30 days", days: 30 },
	{ label: "Last 90 days", days: 90 },
];

function toDateStr(d: Date) {
	return d.toISOString().slice(0, 10);
}

function addDays(dateStr: string, n: number) {
	const d = new Date(dateStr);
	d.setDate(d.getDate() + n);
	return toDateStr(d);
}

function today() {
	return toDateStr(new Date());
}

interface Props {
	value: DateRange;
	onChange: (range: DateRange) => void;
	maxDate?: string;
}

export function DateRangePicker({ value, onChange, maxDate }: Props) {
	const [open, setOpen] = useState(false);
	const [fromInput, setFromInput] = useState(value.from);
	const [toInput, setToInput] = useState(value.to);
	const ref = useRef<HTMLDivElement>(null);

	// Sync inputs when value changes externally
	useEffect(() => {
		setFromInput(value.from);
		setToInput(value.to);
	}, [value.from, value.to]);

	// Close on outside click
	useEffect(() => {
		function handler(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	function applyPreset(days: number) {
		const to = maxDate ?? today();
		const from = addDays(to, -(days - 1));
		onChange({ from, to });
		setOpen(false);
	}

	function applyCustom() {
		if (fromInput && toInput && fromInput <= toInput) {
			onChange({ from: fromInput, to: toInput });
			setOpen(false);
		}
	}

	const label = `${value.from} → ${value.to}`;

	return (
		<div ref={ref} className="relative inline-block">
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
				aria-haspopup="true"
				aria-expanded={open}
			>
				<CalendarDays className="size-4 text-zinc-400" />
				<span>{label}</span>
				<ChevronDown
					className={`size-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open && (
				<div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
					{/* Presets */}
					<div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
						<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
							Quick select
						</p>
						<div className="grid grid-cols-2 gap-1.5">
							{PRESETS.map((p) => (
								<button
									key={p.days}
									type="button"
									onClick={() => applyPreset(p.days)}
									className="rounded-md px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 text-left"
								>
									{p.label}
								</button>
							))}
						</div>
					</div>

					{/* Custom range */}
					<div className="p-3 space-y-3">
						<p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
							Custom range
						</p>
						<div className="flex gap-2 items-center">
							<div className="flex-1">
								<label
									htmlFor="drp-from"
									className="block text-xs text-zinc-500 mb-1"
								>
									From
								</label>
								<input
									id="drp-from"
									type="date"
									value={fromInput}
									max={toInput || maxDate}
									onChange={(e) => setFromInput(e.target.value)}
									className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
								/>
							</div>
							<span className="mt-4 text-zinc-400">–</span>
							<div className="flex-1">
								<label
									htmlFor="drp-to"
									className="block text-xs text-zinc-500 mb-1"
								>
									To
								</label>
								<input
									id="drp-to"
									type="date"
									value={toInput}
									min={fromInput}
									max={maxDate}
									onChange={(e) => setToInput(e.target.value)}
									className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
								/>
							</div>
						</div>
						<button
							type="button"
							onClick={applyCustom}
							disabled={!fromInput || !toInput || fromInput > toInput}
							className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
						>
							Apply
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
