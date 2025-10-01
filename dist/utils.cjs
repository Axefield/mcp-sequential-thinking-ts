"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  convertDictKeys: () => convertDictKeys,
  toCamelCase: () => toCamelCase,
  toSnakeCase: () => toSnakeCase
});
module.exports = __toCommonJS(utils_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertDictKeys,
  toCamelCase,
  toSnakeCase
});
