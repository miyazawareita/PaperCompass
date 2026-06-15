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

以下のJSON形式のみで出力してください。

{
    "summary": "要約",
    "terms": [
        {
            "word": "専門用語",
            "explanation": "説明"
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
            terms: [],
        };
    }
}