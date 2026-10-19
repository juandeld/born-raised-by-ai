import { baseUrl } from "./engine";

/** Twilio posts application/x-www-form-urlencoded. */
export async function twilioParams(req: Request): Promise<Record<string, string>> {
  const text = await req.text();
  return Object.fromEntries(new URLSearchParams(text).entries());
}

/**
 * The URL Twilio signed is the one we gave it (PUBLIC_BASE_URL + path + query), not the internal URL the platform
 * hands to the function. Using the public one keeps the signature check correct behind proxies.
 */
export function twilioPublicUrl(requestUrl: URL): string {
  return `${baseUrl()}${requestUrl.pathname}${requestUrl.search}`;
}
