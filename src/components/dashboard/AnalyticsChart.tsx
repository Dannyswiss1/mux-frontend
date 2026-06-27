export type AnalyticsPoint = {
	label: string;
	value: number;
};

interface AnalyticsChartProps {
	title: string;
	description: string;
	data: AnalyticsPoint[];
	metric: string;
	metricLabel: string;
	lineColor: string;
	fillColor: string;
}

function buildPath(
	data: AnalyticsPoint[],
	width: number,
	height: number,
	padding: number,
) {
	const maxValue = Math.max(...data.map((item) => item.value));
	const chartWidth = width - padding * 2;
	const chartHeight = height - padding * 2;

	return data
		.map((point, index) => {
			const x = padding + (index / Math.max(data.length - 1, 1)) * chartWidth;
			const y =
				padding + chartHeight * (1 - point.value / Math.max(maxValue, 1));
			return `${index === 0 ? "M" : "L"} ${x} ${y}`;
		})
		.join(" ");
}

function buildFill(
	data: AnalyticsPoint[],
	width: number,
	height: number,
	padding: number,
) {
	const path = buildPath(data, width, height, padding);
	const lastX =
		padding +
		((data.length - 1) / Math.max(data.length - 1, 1)) * (width - padding * 2);
	const baseline = height - padding;

	return `${path} L ${lastX} ${baseline} L ${padding} ${baseline} Z`;
}

export function AnalyticsChart({
	title,
	description,
	data,
	metric,
	metricLabel,
	lineColor,
	fillColor,
}: AnalyticsChartProps) {
	const chartWidth = 720;
	const chartHeight = 260;
	const padding = 24;
	const maxValue = Math.max(...data.map((item) => item.value));
	const minValue = Math.min(...data.map((item) => item.value));
	const chartPath = buildPath(data, chartWidth, chartHeight, padding);
	const fillPath = buildFill(data, chartWidth, chartHeight, padding);

	return (
		<div className="rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
			<div className="px-6 py-6 sm:px-8 sm:py-7">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
							{title}
						</h2>
						<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
							{description}
						</p>
					</div>
					<div className="rounded-2xl bg-zinc-100 px-4 py-3 text-right text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
						<p className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
							{metric}
						</p>
						<p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
							{metricLabel}
						</p>
					</div>
				</div>
				<div className="mt-8 overflow-hidden rounded-3xl bg-zinc-50 dark:bg-zinc-900">
					<svg
						viewBox={`0 0 ${chartWidth} ${chartHeight}`}
						className="w-full h-[260px]"
					>
						<defs>
							<linearGradient
								id={`fill-${title.replace(/\W+/g, "-")}`}
								x1="0"
								x2="0"
								y1="0"
								y2="1"
							>
								<stop offset="0%" stopColor={fillColor} stopOpacity="0.26" />
								<stop offset="100%" stopColor={fillColor} stopOpacity="0" />
							</linearGradient>
						</defs>
						<path
							d={fillPath}
							fill={`url(#fill-${title.replace(/\W+/g, "-")})`}
							stroke="none"
						/>
						<path
							d={chartPath}
							fill="none"
							stroke={lineColor}
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						{data.map((point, index) => {
							const x =
								padding +
								(index / Math.max(data.length - 1, 1)) *
									(chartWidth - padding * 2);
							const y =
								padding +
								(chartHeight - padding * 2) *
									(1 - point.value / Math.max(maxValue, 1));
							return (
								<circle
									key={point.label}
									cx={x}
									cy={y}
									r={4}
									fill={lineColor}
									stroke="white"
									strokeWidth="2"
								/>
							);
						})}
					</svg>
				</div>
				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					<div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
						<p className="font-semibold text-zinc-900 dark:text-zinc-50">
							Peak
						</p>
						<p className="mt-2 text-2xl font-semibold">{maxValue}</p>
						<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
							Highest value over the selected interval
						</p>
					</div>
					<div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
						<p className="font-semibold text-zinc-900 dark:text-zinc-50">
							Baseline
						</p>
						<p className="mt-2 text-2xl font-semibold">{minValue}</p>
						<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
							Lowest value in this timeframe
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
