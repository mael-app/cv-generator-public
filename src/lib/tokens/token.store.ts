type TokenEntry = { buffer: Buffer; expiresAt: number };
type TokenMap = Map<string, TokenEntry>;

// Attach to globalThis so the Map is shared across all route module instances
// (Next.js can load each route in its own module context in dev and prod)
declare global {
  var __tokenStore: TokenMap | undefined;
  var __tokenCleanupStarted: boolean | undefined;
}

function getStore(): TokenMap {
  if (!globalThis.__tokenStore) {
    globalThis.__tokenStore = new Map<string, TokenEntry>();
  }
  return globalThis.__tokenStore;
}

function startCleanup() {
  if (globalThis.__tokenCleanupStarted) return;
  globalThis.__tokenCleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [token, entry] of getStore().entries()) {
      if (entry.expiresAt <= now) {
        getStore().delete(token);
      }
    }
  }, 60_000);
}

export const TokenStore = {
  set(token: string, buffer: Buffer, ttlMs = 5 * 60 * 1000) {
    startCleanup();
    getStore().set(token, { buffer, expiresAt: Date.now() + ttlMs });
  },

  get(token: string): Buffer | null {
    const entry = getStore().get(token);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      getStore().delete(token);
      return null;
    }
    return entry.buffer;
  },

  delete(token: string) {
    getStore().delete(token);
  },
};
