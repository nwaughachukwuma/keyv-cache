// Interfaces
/** duration in milliseconds */
export type Milliseconds = number;
export interface CacheHandlers<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl: Milliseconds): Promise<string>;
  has(key: string): Promise<boolean>;
  remove(key: string): Promise<boolean>;
  removePattern(pattern: string): Promise<Array<boolean>>;
  keys(): Promise<string[]>;
  clear(): Promise<boolean>;
}
export interface CacheOptions {
  /** cache namespace */
  namespace?: string;
}
