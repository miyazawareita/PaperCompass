import { GoogleGenAI } from "@google/genai";

export async function generateExplanation(
    abstract: string
) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY!,
    });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
あなたはJSON APIです。
JSON以外の文章を絶対に出力しないでください。
Markdownも使用しないでください。

以下の論文Abstractについて、

1. 情報系学部4年生向けに3行程度で日本語要約してください。
2. この論文を理解する上で重要な専門用語を3〜5個抽出してください。
3. 各専門用語を情報系学部1〜2年生でもわかるように50文字程度で説明してください。
4. この論文を読む理由を１文で作ってください。
    条件：
    - 40~60文字程度
    - 要約をそのまま繰り返さない
    - 「だから読みたい」と思える内容
    - 専門用語を並べるだけは禁止
5. この論文を理解する難易度を星１（簡単）から星５（難しい）までで判定してください。
    評価基準：情報系学部4年生が初見で読む場合（Abstractに専門用語が多いと理解しにくい）

以下のJSON形式のみで出力してください。

{
    "summary": "要約",
    "hook": "AIがカメラ映像だけで渋滞が減らせるか挑戦した研究",
    "difficulty": "★★☆☆☆",
    "terms": [
        {
            "english": "Deep reinforcement learning",
            "japanese": "深層強化学習",
            "explanation": "AIが試行錯誤しながら最適な行動を学ぶ手法。"
        }
    ]
}

Abstract:
${abstract}
`,
        });

        const raw =
            response.text?.replace(/```json|```/g, "").trim() ?? "{}";

        return JSON.parse(raw);

    } catch {
        return {
            summary: "AI要約を生成できませんでした。",
            hook: "",
            difficulty: "",
            terms: [],
        };
    }
}