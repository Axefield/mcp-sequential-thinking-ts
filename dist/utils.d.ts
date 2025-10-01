/**
 * Utility functions for the sequential thinking package.
 *
 * This module contains common utilities used across the package.
 */
/**
 * Convert a snake_case string to camelCase.
 *
 * @param snakeStr - A string in snake_case format
 * @returns The string converted to camelCase
 */
declare function toCamelCase(snakeStr: string): string;
/**
 * Convert a camelCase string to snake_case.
 *
 * @param camelStr - A string in camelCase format
 * @returns The string converted to snake_case
 */
declare function toSnakeCase(camelStr: string): string;
/**
 * Convert all keys in a dictionary using the provided converter function.
 *
 * @param data - Dictionary with keys to convert
 * @param converter - Function to convert the keys (e.g. toCamelCase or toSnakeCase)
 * @returns A new dictionary with converted keys
 */
declare function convertDictKeys<T extends Record<string, any>>(data: T, converter: (key: string) => string): Record<string, any>;

export { convertDictKeys, toCamelCase, toSnakeCase };
