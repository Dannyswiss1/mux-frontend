/**
 * Props for the Toast notification component.
 */
interface ToastProps {
	/** Whether the toast is visible. */
	open: boolean;
	/** The message body displayed inside the toast. */
	message: string;
}

/**
 * Fixed-position toast notification that appears in the bottom-right corner.
 *
 * Renders nothing when `open` is false. Callers are responsible for managing
 * the open state and auto-dismissal timing.
 *
 * @example
 * ```tsx
 * <Toast open={toastOpen} message="Settings saved." />
 * ```
 */
export function Toast({ open, message }: ToastProps) {
	if (!open) {
		return null;
	}

	return (
		<div
			className="fixed right-4 bottom-4 z-50 max-w-xs rounded-2xl bg-zinc-950/95 p-4 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-md
				dark:bg-zinc-800/95 dark:ring-zinc-700/50"
		>
			<div role="status" aria-live="polite" className="space-y-1">
				<p className="text-sm font-semibold text-white dark:text-zinc-100">
					Success
				</p>
				<p className="text-sm text-zinc-300 dark:text-zinc-400">{message}</p>
			</div>
		</div>
	);
}
