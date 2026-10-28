import { describe, it, expect } from "vitest";
import { parseGeminiResponse } from "../lib/gemini";
import { isValidArxivId } from "../lib/arxiv";

describe("parseGeminiResponse", () => {
    it("converts difficulty level to stars", () => {
        const result = parseGeminiResponse(
            JSON.stringify({
                summary: "要約",
                hook: "読む理由",
                difficulty: 2,
                difficulty_reason: "理由",
                terms: [{ english: "LLM", japanese: "大規模言語モデル", explanation: "説明" }],
            })
        );
        expect(result.difficulty).toBe("★★☆☆☆");
        expect(result.terms).toHaveLength(1);
    });

    it("clamps out-of-range difficulty", () => {
        const result = parseGeminiResponse(JSON.stringify({ summary: "s", difficulty: 9 }));
        expect(result.difficulty).toBe("★★★★★");
    });

    it("drops malformed terms", () => {
        const result = parseGeminiResponse(
            JSON.stringify({ summary: "s", terms: [null, { english: "x" }, "str"] })
        );
        expect(result.terms).toEqual([]);
    });

    it("throws when summary is missing", () => {
        expect(() => parseGeminiResponse(JSON.stringify({ hook: "h" }))).toThrow();
        expect(() => parseGeminiResponse("not json")).toThrow();
    });
});

describe("isValidArxivId", () => {
    it("accepts new and old style IDs", () => {
        expect(isValidArxivId("2510.12345")).toBe(true);
        expect(isValidArxivId("2510.12345v2")).toBe(true);
        expect(isValidArxivId("cs/0101001v1")).toBe(true);
    });

    it("rejects anything else", () => {
        expect(isValidArxivId("")).toBe(false);
        expect(isValidArxivId("2510.12345&max_results=1000")).toBe(false);
        expect(isValidArxivId("Please summarize this text")).toBe(false);
    });
});
