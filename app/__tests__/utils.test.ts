import { describe, it, expect } from "vitest";
import {
    normalizePaper,
    formatCategories,
    categoryLabel,
    getDaysAgo,
} from "../components/utils";
import type { Paper } from "../types/Paper";

const mockRawPaper: Paper = {
    id: ["http://arxiv.org/abs/2401.12345"],
    title: ["Test Paper Title"],
    summary: ["This is a test abstract."],
    published: ["2024-01-15T10:30:00Z"],
    author: [
        { name: ["Alice Smith"] },
        { name: ["Bob Johnson"] },
    ],
    category: [
        { $: { term: "cs.AI" } },
        { $: { term: "cs.LG" } },
    ],
};

describe("normalizePaper", () => {
    it("converts array fields to plain strings", () => {
        const result = normalizePaper(mockRawPaper);

        expect(result.id).toBe("http://arxiv.org/abs/2401.12345");
        expect(result.title).toBe("Test Paper Title");
        expect(result.summary).toBe("This is a test abstract.");
        expect(result.published).toBe("2024-01-15T10:30:00Z");
        expect(result.authors).toEqual(["Alice Smith", "Bob Johnson"]);
        expect(result.categories).toEqual(["cs.AI", "cs.LG"]);
    });
});

describe("formatCategories", () => {
    it("returns the categories as-is", () => {
        expect(formatCategories(["cs.AI", "cs.LG"])).toEqual([
            "cs.AI",
            "cs.LG",
        ]);
    });

    it("returns empty array for empty input", () => {
        expect(formatCategories([])).toEqual([]);
    });
});

describe("categoryLabel", () => {
    it("returns Japanese label for known categories", () => {
        expect(categoryLabel("cs.AI")).toBe("🧠 AI");
        expect(categoryLabel("cs.LG")).toBe("🤖 機械学習");
        expect(categoryLabel("cs.CL")).toBe("💬 自然言語処理");
        expect(categoryLabel("cs.CV")).toBe("👁️ コンピュータビジョン");
    });

    it("returns the term itself for unknown categories", () => {
        expect(categoryLabel("cs.XX")).toBe("cs.XX");
    });
});

describe("getDaysAgo", () => {
    it("returns '今日' for today's date", () => {
        const today = new Date().toISOString();
        expect(getDaysAgo(today)).toBe("🆕 今日");
    });

    it("returns '1日前' for yesterday", () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(getDaysAgo(yesterday.toISOString())).toBe("📅 1日前");
    });

    it("returns correct days for older dates", () => {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        expect(getDaysAgo(fiveDaysAgo.toISOString())).toBe("📅 5日前");
    });
});
