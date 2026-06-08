interface ToastProps {
	open: boolean;
	message: string;
}

export function Toast({ open, message }: ToastProps) {
	if (!open) {
		return null;
	}

	return (
		<div className="fixed right-4 bottom-4 z-50 max-w-xs rounded-2xl bg-zinc-950/95 p-4 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
			<div role="status" aria-live="polite" className="space-y-1">
				<p className="text-sm font-semibold">Success</p>
				<p className="text-sm text-zinc-200">{message}</p>
			</div>
		</div>
	);
}
