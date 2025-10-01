// src/utils.ts
function toCamelCase(snakeStr) {
  const components = snakeStr.split("_");
  return components[0] + components.slice(1).map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join("");
}
function toSnakeCase(camelStr) {
  const s1 = camelStr.replace(/(.)([A-Z][a-z]+)/g, "$1_$2");
  return s1.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}
function convertDictKeys(data, converter) {
  if (typeof data !== "object" || data === null) {
    return data;
  }
  const result = {};
  for (const [key, value] of Object.entries(data)) {
    const newKey = converter(key);
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[newKey] = convertDictKeys(value, converter);
    } else if (Array.isArray(value)) {
      result[newKey] = value.map(
        (item) => typeof item === "object" && item !== null ? convertDictKeys(item, converter) : item
      );
    } else {
      result[newKey] = value;
    }
  }
  return result;
}
export {
  convertDictKeys,
  toCamelCase,
  toSnakeCase
};
