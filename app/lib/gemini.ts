import { GoogleGenAI } from "@google/genai";
import { summaryCache } from "./cache";

const PROMPT_TEMPLATE = `
あなたはJSON APIです。
JSON以外の文章を絶対に出力しないでください。
Markdownも使用しないでください。

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
5. Abstractの内容から推測して、この論文を読む難易度を情報系学部4年生基準で★1〜5で評価してください。評価に加えて、「なぜその難易度なのか」を30文字程度で説明してください。

以下のJSON形式のみで出力してください。

{
    "summary": "要約",
    "hook": "AIがカメラ映像だけで渋滞が減らせるか挑戦した研究",
    "difficulty": "★★☆☆☆",
    "difficulty_reason": "機械学習の基礎知識があれば理解しやすい内容。",
    "terms": [
        {
            "english": "Deep reinforcement learning",
            "japanese": "深層強化学習",
            "explanation": "AIが試行錯誤しながら最適な行動を学ぶ手法である強化学習に、深層学習の高いデータ認識・処理能力を組み合わせた技術。"
        }
    ]
}

Abstract:
`;

const FALLBACK_RESULT = {
    summary: "AI要約を生成できませんでした。",
    hook: "",
    difficulty: "",
    difficulty_reason: "",
    terms: [],
};

export async function generateExplanation(abstract: string) {
    const cacheKey = `summary:${abstract.slice(0, 200)}`;
    const cached = summaryCache.get(cacheKey);
    if (cached) return cached;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set");
        return FALLBACK_RESULT;
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${PROMPT_TEMPLATE}${abstract}`,
        });

        const raw = response.text?.replace(/```json|```/g, "").trim() ?? "{}";
        const result = JSON.parse(raw);
        summaryCache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error("Gemini API error:", error);
        return FALLBACK_RESULT;
    }
}
