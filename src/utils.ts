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
export function toCamelCase(snakeStr: string): string {
  const components = snakeStr.split('_');
  // Join with the first component lowercase and the rest with their first letter capitalized
  return components[0] + components.slice(1).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
}

/**
 * Convert a camelCase string to snake_case.
 * 
 * @param camelStr - A string in camelCase format
 * @returns The string converted to snake_case
 */
export function toSnakeCase(camelStr: string): string {
  // Insert underscore before uppercase letters and convert to lowercase
  const s1 = camelStr.replace(/(.)([A-Z][a-z]+)/g, '$1_$2');
  return s1.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

/**
 * Convert all keys in a dictionary using the provided converter function.
 * 
 * @param data - Dictionary with keys to convert
 * @param converter - Function to convert the keys (e.g. toCamelCase or toSnakeCase)
 * @returns A new dictionary with converted keys
 */
export function convertDictKeys<T extends Record<string, any>>(
  data: T, 
  converter: (key: string) => string
): Record<string, any> {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
    
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    // Convert key
    const newKey = converter(key);
    
    // If value is a dict, recursively convert its keys too
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[newKey] = convertDictKeys(value, converter);
    }
    // If value is a list, check if items are dicts and convert them
    else if (Array.isArray(value)) {
      result[newKey] = value.map(item => 
        typeof item === 'object' && item !== null 
          ? convertDictKeys(item, converter) 
          : item
      );
    } else {
      result[newKey] = value;
    }
  }
    
  return result;
}
