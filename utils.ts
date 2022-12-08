export const makeResponse = (result: any, ttl: number) =>
  new Response(JSON.stringify(result), {
    headers: { timestamp: `${Date.now()}`, ttl: `${ttl}` },
  });
export const isValidURL = (str: string) => {
  try {
    return !!new URL(str);
  } catch (e) {
    return false;
  }
};
export function makeKey(_key: string) {
  const key = decodeURIComponent(_key);
  if (isValidURL(key)) return key;

  const u = new URL(window.location.origin);
  u.searchParams.append("key", key);
  return u.href;
}
