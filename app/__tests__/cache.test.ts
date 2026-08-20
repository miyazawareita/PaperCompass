import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryCache } from "../lib/cache";

describe("MemoryCache", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it("stores and retrieves values", () => {
        const cache = new MemoryCache<string>(60);
        cache.set("key1", "value1");
        expect(cache.get("key1")).toBe("value1");
    });

    it("returns null for missing keys", () => {
        const cache = new MemoryCache<string>(60);
        expect(cache.get("missing")).toBeNull();
    });

    it("expires entries after TTL", () => {
        const cache = new MemoryCache<string>(10);
        cache.set("key1", "value1");

        vi.advanceTimersByTime(5000);
        expect(cache.get("key1")).toBe("value1");

        vi.advanceTimersByTime(6000);
        expect(cache.get("key1")).toBeNull();
    });

    it("supports custom TTL per entry", () => {
        const cache = new MemoryCache<string>(60);
        cache.set("short", "val", 1000);
        cache.set("long", "val", 60000);

        vi.advanceTimersByTime(2000);
        expect(cache.get("short")).toBeNull();
        expect(cache.get("long")).toBe("val");
    });

    it("has() returns true for existing entries", () => {
        const cache = new MemoryCache<string>(60);
        cache.set("key1", "value1");
        expect(cache.has("key1")).toBe(true);
        expect(cache.has("missing")).toBe(false);
    });

    it("clear() removes all entries", () => {
        const cache = new MemoryCache<string>(60);
        cache.set("a", "1");
        cache.set("b", "2");
        cache.clear();
        expect(cache.get("a")).toBeNull();
        expect(cache.get("b")).toBeNull();
    });
});
