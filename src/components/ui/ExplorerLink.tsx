"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExplorerType } from "@/utils/explorerUrl";
import { getExplorerUrl, isValidStellarAddress } from "@/utils/explorerUrl";

interface ExplorerLinkProps {
	address: string;
	network: "mainnet" | "testnet";
	type?: ExplorerType;
	variant?: "default" | "ghost" | "outline" | "link";
	size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
	showIcon?: boolean;
	label?: string;
	className?: string;
	title?: string;
}

/**
 * ExplorerLink component for linking to Stellar explorer
 * Handles invalid addresses gracefully by disabling the link
 */
export function ExplorerLink({
	address,
	network,
	type = "account",
	variant = "ghost",
	size = "sm",
	showIcon = true,
	label,
	className,
	title,
}: ExplorerLinkProps) {
	const isValid = isValidStellarAddress(address);

	if (!isValid) {
		return (
			<Button
				variant={variant}
				size={size}
				disabled
				title={title || "Invalid address"}
				className={className}
			>
				{showIcon && <ExternalLink className="h-4 w-4" />}
				{label && <span>{label}</span>}
			</Button>
		);
	}

	const explorerUrl = getExplorerUrl(address, network, type);

	return (
		<Button
			variant={variant}
			size={size}
			asChild
			className={cn("cursor-pointer", className)}
		>
			<a
				href={explorerUrl}
				target="_blank"
				rel="noopener noreferrer"
				title={title || `View on Stellar Explorer (${network})`}
			>
				{showIcon && <ExternalLink className="h-4 w-4" />}
				{label && <span>{label}</span>}
			</a>
		</Button>
	);
}
