/**
 * React hook for formatting Stellar addresses
 * Provides memoized formatting with automatic updates
 */

import { useMemo, useState } from "react";
import {
	type AddressFormatType,
	type AddressFormatterOptions,
	compareAddresses,
	extractFullAddress,
	type FormattedAddress,
	formatAddress,
	formatAddresses,
	getAvailableFormats,
	getFormatDescription,
} from "@/utils/addressFormatter";

/**
 * Hook for formatting a single address
 * Memoizes the result to prevent unnecessary recalculations
 *
 * @param address - The address to format
 * @param options - Formatting options
 * @returns Formatted address object
 *
 * @example
 * const { formatted, isValid } = useAddressFormatter(address, { format: "truncated" });
 */
export function useAddressFormatter(
	address: string,
	options: AddressFormatterOptions = {},
): FormattedAddress {
	return useMemo(() => {
		return formatAddress(address, options);
	}, [
		address,
		options.format,
		options.chunkSize,
		options.separator,
		options.maskChar,
		options.groupSize,
	]);
}

/**
 * Hook for formatting multiple addresses
 * Memoizes the results to prevent unnecessary recalculations
 *
 * @param addresses - Array of addresses to format
 * @param options - Formatting options
 * @returns Array of formatted address objects
 *
 * @example
 * const formatted = useAddressFormatterBatch(addresses, { format: "truncated" });
 */
export function useAddressFormatterBatch(
	addresses: string[],
	options: AddressFormatterOptions = {},
): FormattedAddress[] {
	return useMemo(() => {
		return formatAddresses(addresses, options);
	}, [
		addresses,
		options.format,
		options.chunkSize,
		options.separator,
		options.maskChar,
		options.groupSize,
	]);
}

/**
 * Hook for comparing two addresses
 * Memoizes the comparison result
 *
 * @param address1 - First address
 * @param address2 - Second address
 * @returns Whether the addresses match
 *
 * @example
 * const isMatch = useAddressComparison(userInput, storedAddress);
 */
export function useAddressComparison(
	address1: string,
	address2: string,
): boolean {
	return useMemo(() => {
		return compareAddresses(address1, address2);
	}, [address1, address2]);
}

/**
 * Hook for extracting full address from any format
 * Memoizes the extraction result
 *
 * @param address - Address in any format
 * @returns Full address or null if invalid
 *
 * @example
 * const fullAddress = useExtractFullAddress(userInput);
 */
export function useExtractFullAddress(address: string): string | null {
	return useMemo(() => {
		return extractFullAddress(address);
	}, [address]);
}

/**
 * Hook for getting format description
 * Memoizes the description
 *
 * @param format - Format type
 * @returns Human-readable description
 *
 * @example
 * const description = useFormatDescription("truncated");
 */
export function useFormatDescription(format: AddressFormatType): string {
	return useMemo(() => {
		return getFormatDescription(format);
	}, [format]);
}

/**
 * Hook for getting all available formats
 * Returns memoized array of format types
 *
 * @returns Array of available format types
 *
 * @example
 * const formats = useAvailableFormats();
 */
export function useAvailableFormats(): AddressFormatType[] {
	return useMemo(() => {
		return getAvailableFormats();
	}, []);
}

/**
 * Hook for formatting with format selection
 * Provides both formatted result and format options
 *
 * @param address - The address to format
 * @param defaultFormat - Default format type
 * @returns Object with formatted address and format utilities
 *
 * @example
 * const { formatted, isValid, setFormat, availableFormats } = useAddressFormatterWithSelection(address);
 */
export function useAddressFormatterWithSelection(
	address: string,
	defaultFormat: AddressFormatType = "full",
) {
	const [selectedFormat, setSelectedFormat] =
		useState<AddressFormatType>(defaultFormat);
	const formatted = useAddressFormatter(address, { format: selectedFormat });
	const availableFormats = useAvailableFormats();

	return {
		formatted: formatted.formatted,
		isValid: formatted.isValid,
		error: formatted.error,
		selectedFormat,
		setFormat: setSelectedFormat,
		availableFormats,
		getDescription: (format: AddressFormatType) => getFormatDescription(format),
	};
}
