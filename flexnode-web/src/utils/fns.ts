import { compact, flatten } from "lodash";
import { Resource } from "../definitions/flexnode";
import { AnyFn, AnyObject } from "./types";

export function cast<ToType>(resource: any): ToType {
  return resource as unknown as ToType;
}

export function isObjectEmpty(data: Record<string | number, any>) {
  return Object.keys(data).length === 0;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
export async function noopAsync(...args: any) {}

export function makeKey(
  fields: Array<string | number | undefined | null | boolean>,
  separator = "-",
  omitFalsy = true
) {
  if (omitFalsy) {
    fields = compact(fields);
  }
  return fields.join(separator);
}

export function objectHasData(data: AnyObject) {
  return Object.keys(data).length > 0;
}

export function waitTimeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function reverseMap<K extends string, V extends string>(
  m: Record<K, V>
): Record<V, K> {
  const r: Record<V, K> = cast<Record<V, K>>({});
  for (const k in m) {
    r[m[k]] = k;
  }
  return r;
}

export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function uncapitalizeFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function calculatePageSize(
  count: number,
  pageSize: number,
  /** zero-index based page */ page: number
) {
  count = Math.max(count, 0);
  pageSize = Math.max(pageSize, 0);
  page = Math.max(page, 0);
  if (count === 0 ?? pageSize === 0) return 0;
  const maxFullPages = Math.floor(count / pageSize);
  const pageCount =
    page < maxFullPages ? pageSize : count - maxFullPages * pageSize;
  return pageCount;
}

export function getResourceId(resource: Pick<Resource, "resourceId">) {
  return resource.resourceId;
}

export function extractResourceIdList(
  resources: Pick<Resource, "resourceId">[]
) {
  return resources.map(getResourceId);
}

export function toArray<T>(...args: Array<T | T[]>) {
  const arrays = args.map((item) => {
    if (Array.isArray(item)) {
      return item;
    } else {
      return [item];
    }
  });
  return flatten(arrays);
}

export function toNonNullableArray<T>(...args: Array<NonNullable<T | T[]>>) {
  return toArray(...args);
}

export function toCompactArray<T>(...args: Array<T | T[]>) {
  const array = toArray(...args);
  return compact(array as Array<NonNullable<T> | undefined>);
}

export function defaultArrayTo<T>(array: T[], data: NonNullable<T | T[]>) {
  return array.length ? array : toCompactArray(data);
}

export function loop(count = 1, fn: AnyFn) {
  while (count > 0) {
    fn();
    count -= 1;
  }
}

export function loopAndCollate<Fn extends AnyFn>(
  count = 1,
  fn: Fn
): Array<ReturnType<Fn>> {
  const result: Array<ReturnType<Fn>> = [];
  while (count > 0) {
    result.push(fn());
    count -= 1;
  }
  return result;
}

export function pick00<T>(data: T, keys: Array<keyof T>) {
  return keys.reduce((map, key) => {
    map[key] = data[key];
    return map;
  }, {} as Partial<T>);
}

export function multilineTextToParagraph(text: string) {
  return text.replace(/[\s]+/g, " ").trim();
}

export function sortStringListLexographically(stringList: string[]) {
  return stringList.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}
