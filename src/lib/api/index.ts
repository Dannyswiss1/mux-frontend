import type { ApiKey } from "@/mock-data/api-keys";
import ApiClient from "./client";
import { getApiBaseUrl } from "./config";

// Minimal factory used by the app. The API key may be provided at runtime.
export const createApiClient = (baseUrl = getApiBaseUrl(), apiKey?: string) =>
	new ApiClient(baseUrl, apiKey);

export async function fetchApiKeys(): Promise<ApiKey[]> {
	const res = await fetch("/api/api-keys", { cache: "no-store" });
	if (!res.ok) {
		throw new Error(`Failed to fetch API keys (${res.status})`);
	}
	const json = (await res.json()) as { data: ApiKey[] };
	return json.data;
}

export async function revokeKey(id: string): Promise<ApiKey | null> {
	const keys = await fetchApiKeys();
	const key = keys.find((item) => item.id === id);
	if (!key) {
		return null;
	}
	return { ...key, status: "Revoked" };
}

export default createApiClient;
