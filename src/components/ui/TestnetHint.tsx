"use client";

import { AlertCircle, ExternalLink, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FRIENDBOT_DOCS_URL, FRIENDBOT_URL } from "@/utils/friendbot";

interface TestnetHintProps {
	variant?: "default" | "compact";
	dismissible?: boolean;
	className?: string;
}

/**
 * TestnetHint component displays helpful information about Stellar testnet
 * and Friendbot faucet. Can be dismissed by the user.
 *
 * Behavior:
 * - Shows only on testnet (parent component responsible for conditional rendering)
 * - Dismissible state is local to component (not persisted)
 * - Provides links to Friendbot and documentation
 */
export function TestnetHint({
	variant = "default",
	dismissible = true,
	className,
}: TestnetHintProps) {
	const [isDismissed, setIsDismissed] = useState(false);

	const handleDismiss = useCallback(() => {
		setIsDismissed(true);
	}, []);

	if (isDismissed) {
		return null;
	}

	if (variant === "compact") {
		return (
			<div
				className={cn(
					"flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
					className,
				)}
			>
				<AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
				<p className="text-xs text-amber-700 dark:text-amber-300">
					You&apos;re on testnet.{" "}
					<a
						href={FRIENDBOT_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="underline hover:no-underline font-medium"
					>
						Fund with Friendbot
					</a>
				</p>
				{dismissible && (
					<button
						onClick={handleDismiss}
						className="ml-auto p-0.5 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded transition-colors"
						title="Dismiss"
						type="button"
						aria-label="Dismiss testnet hint"
					>
						<X className="h-3 w-3 text-amber-600 dark:text-amber-400" />
					</button>
				)}
			</div>
		);
	}

	// Default variant
	return (
		<div
			className={cn(
				"rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20",
				className,
			)}
		>
			<div className="flex gap-3">
				<div className="flex-shrink-0">
					<AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
				</div>
				<div className="flex-1 space-y-2">
					<h3 className="font-semibold text-amber-900 dark:text-amber-100">
						You&apos;re on Stellar Testnet
					</h3>
					<p className="text-sm text-amber-800 dark:text-amber-200">
						This is a test network for development and testing. Use{" "}
						<a
							href={FRIENDBOT_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium underline hover:no-underline"
						>
							Friendbot
						</a>{" "}
						to fund new accounts with test XLM.
					</p>
					<div className="flex flex-wrap gap-2 pt-2">
						<Button variant="outline" size="sm" asChild className="h-8 text-xs">
							<a href={FRIENDBOT_URL} target="_blank" rel="noopener noreferrer">
								<ExternalLink className="h-3 w-3" />
								Open Friendbot
							</a>
						</Button>
						<Button variant="outline" size="sm" asChild className="h-8 text-xs">
							<a
								href={FRIENDBOT_DOCS_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								<ExternalLink className="h-3 w-3" />
								Learn More
							</a>
						</Button>
					</div>
				</div>
				{dismissible && (
					<button
						onClick={handleDismiss}
						className="flex-shrink-0 p-1 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded transition-colors"
						title="Dismiss"
						type="button"
						aria-label="Dismiss testnet hint"
					>
						<X className="h-4 w-4 text-amber-600 dark:text-amber-400" />
					</button>
				)}
			</div>
		</div>
	);
}
