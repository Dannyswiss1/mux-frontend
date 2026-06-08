const { loadSession, saveSession, clearSession } = require("./session");

const REQUEST_ID_HEADER = "x-request-id";

function requestIdHeader() {
	return `req-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function buildHeaders(initHeaders) {
	const headers = new Headers(initHeaders || {});
	headers.set("accept", "application/json");
	headers.set(REQUEST_ID_HEADER, requestIdHeader());

	const session = loadSession();
	if (session?.accessToken) {
		headers.set("authorization", `Bearer ${session.accessToken}`);
	}

	return headers;
}

async function refreshSession() {
	const session = loadSession();
	if (!session?.refreshToken) return null;

	const response = await fetch("/api/auth/refresh", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			[REQUEST_ID_HEADER]: requestIdHeader(),
		},
		body: JSON.stringify({ refreshToken: session.refreshToken }),
	});

	if (!response.ok) {
		clearSession();
		return null;
	}

	const payload = await response.json();
	if (!payload?.accessToken || !payload?.refreshToken) {
		clearSession();
		return null;
	}

	const refreshed = {
		accessToken: payload.accessToken,
		refreshToken: payload.refreshToken,
		expiresAt: Date.now() + Number(payload.expiresIn ?? 30) * 1000,
	};

	saveSession(refreshed);
	return refreshed;
}

async function apiFetch(path, init = {}) {
	const url = path.startsWith("/") ? path : `/${path}`;
	let headers = buildHeaders(init.headers);

	const response = await fetch(url, {
		...init,
		headers,
		credentials: "include",
	});

	if (response.status === 401) {
		const refreshed = await refreshSession();
		if (!refreshed) {
			throw new Error("Unauthorized");
		}

		headers = buildHeaders(init.headers);
		const retry = await fetch(url, {
			...init,
			headers,
			credentials: "include",
		});
		if (!retry.ok) {
			throw new Error((await retry.text()) || "Request failed");
		}
		return retry.json();
	}

	if (!response.ok) {
		throw new Error((await response.text()) || "Request failed");
	}

	return response.json();
}

module.exports = {
	requestIdHeader,
	apiFetch,
	refreshSession,
};
