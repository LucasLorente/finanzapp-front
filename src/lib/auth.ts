const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setAuthToken(token: string): void {
  document.cookie = `${COOKIE_NAME}=${token.trim()}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict`;
}

export function removeAuthToken(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export function getClientAuthToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const row = document.cookie.split("; ").find((r) => r.startsWith(`${COOKIE_NAME}=`));
  return row ? row.substring(COOKIE_NAME.length + 1) : undefined;
}
