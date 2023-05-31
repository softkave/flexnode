export type AnyFn<Args extends any[] = any[], Result = any> = (
  ...args: Args
) => Result;

export type AnyObject = { [k: string | number | symbol]: any };
export type ObjectValues<T> = T[keyof T];
export type PartialRecord<K extends string | number | symbol, T> = {
  [P in K]?: T;
};

export type GetTypeFromTypeOrArray<T> = T extends Array<infer T1> ? T1 : T;
export type InvertRecord<M> = M extends Record<infer K, infer V>
  ? V extends string | number | symbol
    ? Record<V, K>
    : Record<string, K>
  : never;

export type DefaultTo<
  T,
  TDefault,
  TDefaultFrom = undefined
> = T extends TDefaultFrom ? TDefault : T;
