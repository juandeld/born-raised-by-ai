/** Local phone digits -> E.164 with the country's calling code. A number that already starts with + is kept. */
export function toE164(raw: string, callingCode: string): string {
  const t = raw.trim();
  if (t.startsWith("+")) return `+${t.replace(/\D/g, "")}`;
  return `+${callingCode}${t.replace(/\D/g, "").replace(/^0+/, "")}`;
}
