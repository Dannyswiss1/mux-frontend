import { getEnv } from "@/lib/env";

export function getApiBaseUrl(): string {
	const env = getEnv();
	return (
		env.NEXT_PUBLIC_API_URL ??
		env.NEXT_PUBLIC_MUX_API_URL ??
		env.NEXT_PUBLIC_API_BASE ??
		""
	);
}

export function getApiKey(): string | undefined {
	return getEnv().NEXT_PUBLIC_MUX_API_KEY;
}
