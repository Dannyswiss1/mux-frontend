"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface FAQItem {
	id: string;
	question: string;
	answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
	{
		id: "what-is-recovery",
		question: "What is invisible wallet recovery?",
		answer:
			"Invisible wallet recovery is an automatic system that keeps your wallet accessible even if you lose your device or account credentials. It works silently in the background — no seed phrases or manual steps required.",
	},
	{
		id: "how-long",
		question: "How long does recovery take?",
		answer:
			"Most recovery operations complete within a few minutes. Complex scenarios involving network issues or multiple devices may take up to 24 hours. Your funds remain secure throughout the entire process.",
	},
	{
		id: "is-it-safe",
		question: "Is my recovery data safe?",
		answer:
			"Yes. All recovery data is encrypted at rest and in transit. Your private keys never leave secure storage and are never exposed during the recovery process. Recovery uses encrypted methods that do not require key exposure.",
	},
	{
		id: "when-triggered",
		question: "When is recovery automatically triggered?",
		answer:
			"Recovery is triggered automatically when the system detects device loss, authentication failures, or prolonged network disconnection. You can also initiate it manually from this page if you believe your wallet needs immediate attention.",
	},
	{
		id: "what-not-covered",
		question: "What does recovery NOT cover?",
		answer:
			"Recovery cannot restore funds sent to incorrect addresses or lost due to user error. Always verify transaction details before confirming. Recovery is designed to restore wallet access, not reverse completed transactions.",
	},
	{
		id: "contact-support",
		question: "What if recovery doesn't complete after 24 hours?",
		answer:
			"If your wallet is still inaccessible after 24 hours, or if you notice any suspicious activity, contact our support team immediately. Do not attempt multiple manual recovery initiations as this may delay the process.",
	},
];

interface RecoveryFAQProps {
	/** Override the default FAQ items — useful for testing or custom content. */
	items?: FAQItem[];
	className?: string;
}

interface FAQItemProps {
	item: FAQItem;
	isOpen: boolean;
	onToggle: () => void;
}

function FAQRow({ item, isOpen, onToggle }: FAQItemProps) {
	return (
		<div className="border-b border-zinc-200 dark:border-zinc-800 last:border-0">
			<button
				type="button"
				aria-expanded={isOpen}
				aria-controls={`faq-answer-${item.id}`}
				id={`faq-question-${item.id}`}
				onClick={onToggle}
				className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-sm"
			>
				<span>{item.question}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					aria-hidden="true"
					className={cn(
						"w-4 h-4 shrink-0 text-zinc-400 transition-transform duration-200",
						isOpen && "rotate-180",
					)}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<div
				id={`faq-answer-${item.id}`}
				role="region"
				aria-labelledby={`faq-question-${item.id}`}
				hidden={!isOpen}
				className="pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed"
			>
				{item.answer}
			</div>
		</div>
	);
}

/**
 * Accordion FAQ section for the recovery page.
 * Each item is independently expandable/collapsible.
 * Handles an empty items array gracefully with a fallback message.
 */
export function RecoveryFAQ({
	items = FAQ_ITEMS,
	className,
}: RecoveryFAQProps) {
	const [openId, setOpenId] = useState<string | null>(null);

	const toggle = (id: string) => {
		setOpenId((prev) => (prev === id ? null : id));
	};

	return (
		<section
			aria-labelledby="recovery-faq-heading"
			className={cn(
				"rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
				className,
			)}
		>
			<h2
				id="recovery-faq-heading"
				className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4"
			>
				Frequently Asked Questions
			</h2>

			{items.length === 0 ? (
				<p className="text-sm text-zinc-500 dark:text-zinc-400">
					No FAQ items available.
				</p>
			) : (
				<div role="list" className="mb-4">
					{items.map((item) => (
						<div key={item.id} role="listitem">
							<FAQRow
								item={item}
								isOpen={openId === item.id}
								onToggle={() => toggle(item.id)}
							/>
						</div>
					))}
				</div>
			)}

			<div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<p className="text-sm text-zinc-600 dark:text-zinc-400">
					Looking for more technical details? Check out our complete recovery guide.
				</p>
				<RecoveryDocsLink />
			</div>
		</section>
	);
}
