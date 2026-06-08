import "@testing-library/jest-dom";

// Mock next/navigation used by DashboardLayout / Sidebar
vi.mock("next/navigation", () => ({
	usePathname: vi.fn(() => "/demo/dashboard/wallets"),
	useRouter: vi.fn(() => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
	})),
}));

// Mock next/font/google used by the root layout
vi.mock("next/font/google", () => ({
	Inter: () => ({ className: "inter" }),
}));

// Mock next/link so it renders a plain <a> in tests
vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		...rest
	}: {
		href: string;
		children: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<a href={href} {...rest}>
			{children}
		</a>
	),
}));

// Provide a navigator.clipboard stub for jsdom
Object.defineProperty(navigator, "clipboard", {
	value: {
		writeText: vi.fn().mockResolvedValue(undefined),
	},
	writable: true,
	configurable: true,
});
