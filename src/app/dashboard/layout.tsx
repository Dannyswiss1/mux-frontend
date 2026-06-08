import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Mux Protocol developer dashboard",
};

export default function DashboardRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <DashboardLayout>{children}</DashboardLayout>;
}
