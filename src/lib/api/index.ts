import ApiClient from "./client";
import { getApiBaseUrl } from "./config";

// Minimal factory used by the app. The API key may be provided at runtime.
export const createApiClient = (baseUrl = getApiBaseUrl(), apiKey?: string) =>
	new ApiClient(baseUrl, apiKey);

export default createApiClient;
