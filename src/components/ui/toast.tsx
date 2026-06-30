import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info";

export interface ToastProps {
	open: boolean;
	/** The message body displayed inside the toast. */
	message: string;
	/** Visual variant controlling icon and colour scheme. Defaults to "success". */
	variant?: ToastVariant;
	/** Overrides the default variant title. */
	title?: string;
	/** When provided, renders a close button that calls this function. */
	onClose?: () => void;
}

const VARIANT_STYLES: Record<
	ToastVariant,
	{ container: string; title: string }
> = {
	success: {
		container: "bg-zinc-950/95",
		title: "Success",
	},
	error: {
		container: "bg-red-950/95",
		title: "Error",
	},
	info: {
		container: "bg-blue-950/95",
		title: "Info",
	},
};

export function Toast({
	open,
	message,
	variant = "success",
	title,
	onClose,
}: ToastProps) {
	if (!open) {
		return null;
	}

	const { container, title: defaultTitle } = VARIANT_STYLES[variant];
	const displayTitle = title ?? defaultTitle;

	return (
		<div
			className={cn(
				"fixed right-4 bottom-4 z-50 max-w-xs rounded-2xl p-4 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-md",
				container,
			)}
		>
			<div role="status" aria-live="polite" className="space-y-1">
				<div className="flex items-center justify-between gap-2">
					<p className="text-sm font-semibold">{displayTitle}</p>
					{onClose && (
						<button
							type="button"
							onClick={onClose}
							aria-label="Close notification"
							className="shrink-0 text-white/60 transition-colors hover:text-white"
						>
							<span aria-hidden="true">×</span>
						</button>
					)}
				</div>
				<p className="text-sm text-zinc-200">{message}</p>
			</div>
		</div>
	);
}
