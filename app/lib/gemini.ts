import { GoogleGenAI } from "@google/genai";
import { summaryCache } from "./cache";
import type { SummaryResult } from "../types/SummaryResult";

// モデルはVercelの環境変数 GEMINI_MODEL で差し替えられる
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const PROMPT_TEMPLATE = `
以下の論文Abstractについて、

1. 情報系学部4年生向けに3行程度で日本語要約してください。
2. この論文を理解する上で重要な重要キーワードを3〜5個抽出してください。
3. 各重要キーワードを情報系学部1〜2年生でもわかるように50文字程度で説明してください。
4. この論文を読む理由を１文で作ってください。
    条件：
    - 40~60文字程度
    - 要約をそのまま繰り返さない
    - 「だから読みたい」と思える内容
    - 専門用語を並べるだけは禁止
    例：「AIがカメラ映像だけで渋滞が減らせるか挑戦した研究」
5. Abstractの内容から推測して、この論文を読む難易度を情報系学部4年生基準で1〜5の整数で評価してください。評価に加えて、「なぜその難易度なのか」を30文字程度で説明してください。

Abstract:
`;

// Geminiの構造化出力。JSON以外を返さないことをAPI側で保証させる
const RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        summary: { type: "string" },
        hook: { type: "string" },
        difficulty: { type: "integer", minimum: 1, maximum: 5 },
        difficulty_reason: { type: "string" },
        terms: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    english: { type: "string" },
                    japanese: { type: "string" },
                    explanation: { type: "string" },
                },
                required: ["english", "japanese", "explanation"],
            },
        },
    },
    required: ["summary", "hook", "difficulty", "difficulty_reason", "terms"],
};

export class GeminiError extends Error {
    constructor(
        message: string,
        readonly status: number
    ) {
        super(message);
    }
}

function toStars(level: number) {
    const n = Math.min(5, Math.max(1, Math.round(level)));
    return "★".repeat(n) + "☆".repeat(5 - n);
}

export function parseGeminiResponse(raw: string): SummaryResult {
    const data = JSON.parse(raw);

    if (typeof data?.summary !== "string" || data.summary.trim() === "") {
        throw new Error("summary is missing");
    }

    return {
        summary: data.summary,
        hook: typeof data.hook === "string" ? data.hook : "",
        difficulty: typeof data.difficulty === "number" ? toStars(data.difficulty) : "",
        difficulty_reason:
            typeof data.difficulty_reason === "string" ? data.difficulty_reason : "",
        terms: Array.isArray(data.terms)
            ? data.terms.filter(
                  (t: unknown): t is SummaryResult["terms"][number] =>
                      typeof t === "object" &&
                      t !== null &&
                      typeof (t as Record<string, unknown>).japanese === "string" &&
                      typeof (t as Record<string, unknown>).explanation === "string"
              )
            : [],
    };
}

export async function generateExplanation(
    paperId: string,
    abstract: string
): Promise<SummaryResult> {
    const cacheKey = `summary:${paperId}`;
    const cached = summaryCache.get(cacheKey) as SummaryResult | null;
    if (cached) return cached;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set");
        throw new GeminiError("サーバーにGemini APIキーが設定されていません。", 500);
    }

    const ai = new GoogleGenAI({ apiKey });

    let text: string | undefined;
    try {
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: `${PROMPT_TEMPLATE}${abstract}`,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: RESPONSE_SCHEMA,
            },
        });
        text = response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        const status = (error as { status?: number }).status;
        if (status === 429) {
            throw new GeminiError(
                "AIが混み合っています。少し時間をおいてお試しください。",
                429
            );
        }
        throw new GeminiError("AI解説の生成に失敗しました。", 502);
    }

    try {
        const result = parseGeminiResponse(text ?? "");
        summaryCache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error("Gemini returned unexpected output:", error, text);
        throw new GeminiError("AI解説の形式が不正でした。もう一度お試しください。", 502);
    }
}
