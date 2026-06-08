"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

export interface AuthUser {
	name: string;
	email: string;
	role: string;
}

/** Shape of a persisted session record. */
interface SessionRecord {
	user: AuthUser;
	/** Unix timestamp (ms) when the session expires. */
	expiresAt: number;
}

interface AuthContextValue {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	signIn: (user: AuthUser, ttlMs?: number) => void;
	signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** sessionStorage key for the user record (client-side rehydration). */
const SESSION_STORAGE_KEY = "mux_auth_user";

/** Cookie name read by the Next.js middleware for server-side route protection. */
const SESSION_COOKIE_NAME = "mux_auth_session";

/** Default session lifetime: 8 hours. */
const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Cookie helpers (client-side only)
// ---------------------------------------------------------------------------

function setSessionCookie(ttlMs: number): void {
	const maxAge = Math.floor(ttlMs / 1000);
	// SameSite=Lax is safe for same-origin navigation; Secure is omitted here
	// so it works on localhost — add "; Secure" in production via a server-set cookie.
	document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearSessionCookie(): void {
	document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	/** Rehydrate session from sessionStorage on mount and validate expiry. */
	useEffect(() => {
		try {
			const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
			if (stored) {
				const record = JSON.parse(stored) as SessionRecord;
				if (record.expiresAt > Date.now()) {
					setUser(record.user);
					// Re-sync cookie in case it was cleared (e.g. browser restart)
					const remainingMs = record.expiresAt - Date.now();
					setSessionCookie(remainingMs);
				} else {
					// Session expired — clean up stale data
					sessionStorage.removeItem(SESSION_STORAGE_KEY);
					clearSessionCookie();
				}
			}
		} catch {
			// Corrupt storage — treat as unauthenticated
			sessionStorage.removeItem(SESSION_STORAGE_KEY);
			clearSessionCookie();
		} finally {
			setIsLoading(false);
		}
	}, []);

	const signIn = useCallback((authUser: AuthUser, ttlMs = DEFAULT_TTL_MS) => {
		const record: SessionRecord = {
			user: authUser,
			expiresAt: Date.now() + ttlMs,
		};
		sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(record));
		setSessionCookie(ttlMs);
		setUser(authUser);
	}, []);

	const signOut = useCallback(() => {
		sessionStorage.removeItem(SESSION_STORAGE_KEY);
		clearSessionCookie();
		setUser(null);
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated: user !== null,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

/**
 * Alias exported for issue #40 — "Integrate session provider".
 * Consumers can import either `AuthProvider` or `SessionProvider`; they are
 * the same component.
 */
export const SessionProvider = AuthProvider;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error(
			"useAuth must be used within an AuthProvider / SessionProvider",
		);
	}
	return ctx;
}

/** Convenience alias for `useAuth`. */
export const useSession = useAuth;
