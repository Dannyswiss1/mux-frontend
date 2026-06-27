import { cn } from "@/lib/utils";
import React from "react";

export interface RecoveryDocsLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	className?: string;
	href?: string;
}

export function RecoveryDocsLink({
	className,
	href = "https://docs.mux.network/recovery",
	children = "Read Docs",
	...props
}: RecoveryDocsLinkProps) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Read recovery documentation (opens in a new tab)"
			className={cn(
				"inline-flex shrink-0 items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
				className,
			)}
			{...props}
		>
			<span>{children}</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={2}
				stroke="currentColor"
				className="h-4 w-4"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
				/>
			</svg>
		</a>
	);
}