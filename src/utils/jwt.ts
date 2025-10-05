export type JwtPayload = Record<string, unknown> & {
  username?: string;
  email?: string;
  profileId?: string;
  sub?: string;
};

export function decodeJwt<T extends JwtPayload = JwtPayload>(token?: string | null): T | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
