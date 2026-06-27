type ToastVariant = "success" | "error";

interface ToastProps {
	open: boolean;
	message: string;
	variant?: ToastVariant;
}

const variantStyles: Record<ToastVariant, { label: string; classes: string }> = {
	success: {
		label: "Success",
		classes: "bg-zinc-950/95 text-white ring-white/10",
	},
	error: {
		label: "Error",
		classes: "bg-red-950/95 text-white ring-red-500/20",
	},
};

export function Toast({ open, message, variant = "success" }: ToastProps) {
	if (!open) return null;

	const { label, classes } = variantStyles[variant];

	return (
		<div
			className={`fixed right-4 bottom-4 z-50 max-w-xs rounded-2xl p-4 shadow-2xl ring-1 backdrop-blur-md ${classes}`}
		>
			<div role="status" aria-live="polite" className="space-y-1">
				<p className="text-sm font-semibold">{label}</p>
				<p className="text-sm text-zinc-200">{message}</p>
			</div>
		</div>
	);
}
