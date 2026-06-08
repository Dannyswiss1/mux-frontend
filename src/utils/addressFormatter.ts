/**
 * Comprehensive Stellar address formatting utilities
 * Provides multiple formatting options for display, storage, and transmission
 */

export type AddressFormatType =
	| "full"
	| "truncated"
	| "short"
	| "chunked"
	| "masked"
	| "grouped";

export interface FormattedAddress {
	original: string;
	formatted: string;
	format: AddressFormatType;
	isValid: boolean;
	error: string | null;
}

export interface AddressFormatterOptions {
	format?: AddressFormatType;
	chunkSize?: number;
	separator?: string;
	maskChar?: string;
	groupSize?: number;
}

/**
 * Validates if a string is a valid Stellar address
 * Stellar addresses start with 'G' and are 56 characters long
 */
function isValidAddress(address: string): boolean {
	if (!address || typeof address !== "string") return false;
	return /^G[A-Z2-7]{55}$/.test(address);
}

/**
 * Formats address as full (no changes)
 * @param address - The address to format
 * @returns The full address
 */
export function formatFull(address: string): string {
	if (!isValidAddress(address)) return address;
	return address;
}

/**
 * Formats address as truncated (6...4 pattern)
 * Example: "GBZXN7...MADI"
 * @param address - The address to format
 * @returns The truncated address
 */
export function formatTruncated(address: string): string {
	if (!isValidAddress(address)) return address;
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formats address as short (first 12 characters)
 * Example: "GBZXN7PIRZGN"
 * @param address - The address to format
 * @returns The short address
 */
export function formatShort(address: string): string {
	if (!isValidAddress(address)) return address;
	return address.slice(0, 12);
}

/**
 * Formats address in chunks for readability
 * Example: "GBZXN7 PIRZGN MHGA7M UUUF4G WPY5AY PV6LY4 UV2GL6 VJGIQR XFDNMA DI"
 * @param address - The address to format
 * @param chunkSize - Size of each chunk (default: 7)
 * @param separator - Separator between chunks (default: " ")
 * @returns The chunked address
 */
export function formatChunked(
	address: string,
	chunkSize: number = 7,
	separator: string = " ",
): string {
	if (!isValidAddress(address)) return address;
	if (chunkSize <= 0) return address;

	const chunks: string[] = [];
	for (let i = 0; i < address.length; i += chunkSize) {
		chunks.push(address.slice(i, i + chunkSize));
	}
	return chunks.join(separator);
}

/**
 * Formats address with masked characters
 * Example: "GBZXN7PIRZGN****MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI"
 * @param address - The address to format
 * @param maskChar - Character to use for masking (default: "*")
 * @param visibleChars - Number of visible characters from start and end (default: 12)
 * @returns The masked address
 */
export function formatMasked(
	address: string,
	maskChar: string = "*",
	visibleChars: number = 12,
): string {
	if (!isValidAddress(address)) return address;
	if (visibleChars < 0 || visibleChars * 2 > address.length) return address;

	const start = address.slice(0, visibleChars);
	const end = address.slice(-visibleChars);
	const maskedLength = address.length - visibleChars * 2;
	const masked = maskChar.repeat(maskedLength);

	return `${start}${masked}${end}`;
}

/**
 * Formats address in groups (4 chars per group)
 * Example: "GBZX N7PI RZGN MHGA 7MUU UF4G WPY5 AYPV 6LY4 UV2G L6VJ GIQR XFDN MADI"
 * @param address - The address to format
 * @param groupSize - Size of each group (default: 4)
 * @param separator - Separator between groups (default: " ")
 * @returns The grouped address
 */
export function formatGrouped(
	address: string,
	groupSize: number = 4,
	separator: string = " ",
): string {
	if (!isValidAddress(address)) return address;
	if (groupSize <= 0) return address;

	const groups: string[] = [];
	for (let i = 0; i < address.length; i += groupSize) {
		groups.push(address.slice(i, i + groupSize));
	}
	return groups.join(separator);
}

/**
 * Formats an address according to specified format type
 * @param address - The address to format
 * @param options - Formatting options
 * @returns Formatted address object with metadata
 */
export function formatAddress(
	address: string,
	options: AddressFormatterOptions = {},
): FormattedAddress {
	const {
		format = "full",
		chunkSize = 7,
		separator = " ",
		maskChar = "*",
		groupSize = 4,
	} = options;

	// Validate input
	if (!address || typeof address !== "string") {
		return {
			original: address || "",
			formatted: "",
			format,
			isValid: false,
			error: "Invalid address input",
		};
	}

	// Sanitize address
	const sanitized = address.trim().toUpperCase();

	// Validate address format
	if (!isValidAddress(sanitized)) {
		return {
			original: address,
			formatted: address,
			format,
			isValid: false,
			error: "Invalid Stellar address format",
		};
	}

	// Apply formatting
	let formatted: string;
	try {
		switch (format) {
			case "truncated":
				formatted = formatTruncated(sanitized);
				break;
			case "short":
				formatted = formatShort(sanitized);
				break;
			case "chunked":
				formatted = formatChunked(sanitized, chunkSize, separator);
				break;
			case "masked":
				formatted = formatMasked(sanitized, maskChar);
				break;
			case "grouped":
				formatted = formatGrouped(sanitized, groupSize, separator);
				break;
			case "full":
			default:
				formatted = formatFull(sanitized);
				break;
		}

		return {
			original: address,
			formatted,
			format,
			isValid: true,
			error: null,
		};
	} catch (err) {
		const errorMessage =
			err instanceof Error ? err.message : "Formatting error";
		return {
			original: address,
			formatted: address,
			format,
			isValid: false,
			error: errorMessage,
		};
	}
}

/**
 * Gets a human-readable description of a format type
 * @param format - The format type
 * @returns Description of the format
 */
export function getFormatDescription(format: AddressFormatType): string {
	const descriptions: Record<AddressFormatType, string> = {
		full: "Full address (56 characters)",
		truncated: "Truncated (6...4 pattern)",
		short: "Short (first 12 characters)",
		chunked: "Chunked (7 characters per chunk)",
		masked: "Masked (first and last 12 visible)",
		grouped: "Grouped (4 characters per group)",
	};
	return descriptions[format] || "Unknown format";
}

/**
 * Gets all available format types
 * @returns Array of available format types
 */
export function getAvailableFormats(): AddressFormatType[] {
	return ["full", "truncated", "short", "chunked", "masked", "grouped"];
}

/**
 * Validates formatting options
 * @param options - Options to validate
 * @returns Validation result with error message if invalid
 */
export function validateFormattingOptions(options: AddressFormatterOptions): {
	isValid: boolean;
	error: string | null;
} {
	if (options.chunkSize !== undefined && options.chunkSize <= 0) {
		return { isValid: false, error: "chunkSize must be greater than 0" };
	}

	if (options.groupSize !== undefined && options.groupSize <= 0) {
		return { isValid: false, error: "groupSize must be greater than 0" };
	}

	if (
		options.separator !== undefined &&
		typeof options.separator !== "string"
	) {
		return { isValid: false, error: "separator must be a string" };
	}

	if (options.maskChar !== undefined && typeof options.maskChar !== "string") {
		return { isValid: false, error: "maskChar must be a string" };
	}

	return { isValid: true, error: null };
}

/**
 * Batch formats multiple addresses
 * @param addresses - Array of addresses to format
 * @param options - Formatting options
 * @returns Array of formatted address objects
 */
export function formatAddresses(
	addresses: string[],
	options: AddressFormatterOptions = {},
): FormattedAddress[] {
	if (!Array.isArray(addresses)) return [];
	return addresses.map((address) => formatAddress(address, options));
}

/**
 * Compares two addresses (ignoring formatting)
 * @param address1 - First address
 * @param address2 - Second address
 * @returns true if addresses are the same (ignoring formatting)
 */
export function compareAddresses(address1: string, address2: string): boolean {
	if (!address1 || !address2) return false;
	const clean1 = address1.replace(/[^G-Z2-7]/g, "").toUpperCase();
	const clean2 = address2.replace(/[^G-Z2-7]/g, "").toUpperCase();
	return clean1 === clean2 && isValidAddress(clean1);
}

/**
 * Extracts the full address from any format
 * @param address - Address in any format
 * @returns The full address if valid, null otherwise
 */
export function extractFullAddress(address: string): string | null {
	if (!address || typeof address !== "string") return null;

	// Remove all non-address characters
	const cleaned = address.replace(/[^G-Z2-7]/g, "").toUpperCase();

	// Check if it's a valid address
	if (isValidAddress(cleaned)) {
		return cleaned;
	}

	return null;
}
