"use client";

import React from "react";

// Lightweight provider shim named to match react-query usage in the codebase.
export function ReactQueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// This is intentionally minimal: if the real `@tanstack/react-query` is added later,
	// swapping this file for the real provider will be straightforward.
	return <>{children}</>;
}

export default ReactQueryProvider;
