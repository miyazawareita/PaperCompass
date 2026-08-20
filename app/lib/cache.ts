interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

export class MemoryCache<T> {
    private store = new Map<string, CacheEntry<T>>();
    private defaultTTL: number;

    constructor(defaultTTLSeconds: number) {
        this.defaultTTL = defaultTTLSeconds * 1000;
    }

    get(key: string): T | null {
        const entry = this.store.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }

        return entry.value;
    }

    set(key: string, value: T, ttlMs?: number): void {
        this.store.set(key, {
            value,
            expiresAt: Date.now() + (ttlMs ?? this.defaultTTL),
        });
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    clear(): void {
        this.store.clear();
    }
}

export const arxivCache = new MemoryCache<string>(5 * 60); // 5 minutes
export const summaryCache = new MemoryCache<unknown>(60 * 60); // 1 hour
