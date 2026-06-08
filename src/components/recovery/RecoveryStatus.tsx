import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type RecoveryStatusValue =
	| "active"
	| "monitoring"
	| "ready"
	| "error"
	| "disconnected"
	| "unknown";

export interface RecoveryStatusProps {
	status?: RecoveryStatusValue;
	className?: string;
}

interface StatusStyle {
	dot: string;
	badge: string;
	label: string;
	ariaLabel: string;
}

const STATUS_STYLES: Record<RecoveryStatusValue, StatusStyle> = {
	active: {
		dot: "bg-green-500",
		badge:
			"bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
		label: "Active",
		ariaLabel: "Recovery status: active",
	},
	monitoring: {
		dot: "bg-yellow-500 animate-pulse",
		badge:
			"bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
		label: "Monitoring",
		ariaLabel: "Recovery status: monitoring",
	},
	ready: {
		dot: "bg-blue-500",
		badge:
			"bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
		label: "Ready",
		ariaLabel: "Recovery status: ready",
	},
	error: {
		dot: "bg-red-500",
		badge:
			"bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
		label: "Error",
		ariaLabel: "Recovery status: error",
	},
	disconnected: {
		dot: "bg-zinc-400",
		badge:
			"bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700",
		label: "Disconnected",
		ariaLabel: "Recovery status: disconnected",
	},
	unknown: {
		dot: "bg-zinc-300 dark:bg-zinc-600",
		badge:
			"bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800/40 dark:text-zinc-500 dark:border-zinc-700",
		label: "Unknown",
		ariaLabel: "Recovery status: unknown",
	},
};

/**
 * Resolves an unrecognised status value to "unknown" so the badge
 * always renders gracefully instead of crashing.
 */
function resolveStatus(status: string): RecoveryStatusValue {
	return status in STATUS_STYLES ? (status as RecoveryStatusValue) : "unknown";
}

export function RecoveryStatus({
	status = "active",
	className,
}: RecoveryStatusProps) {
	const resolved = resolveStatus(status);
	const { dot, badge, label, ariaLabel } = STATUS_STYLES[resolved];

	return (
		<Badge
			variant="outline"
			aria-label={ariaLabel}
			className={cn(badge, className)}
		>
			<span
				className={cn("h-2 w-2 rounded-full shrink-0", dot)}
				aria-hidden="true"
			/>
			{label}
		</Badge>
	);
}
