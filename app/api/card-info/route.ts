import { GoogleGenAI } from "@google/genai";

export async function POST(
    request: Request
) {

    const {
        title,
        abstract,
    } = await request.json();

    const ai = new GoogleGenAI({
        apiKey:
            process.env.GEMINI_API_KEY!,
    });

    const response =
        await ai.models.generateContent({

            model:
                "gemini-2.5-flash",

            contents: `
以下の論文について

1. ニュース見出し風の紹介文
(20〜40文字)

2. 難易度
★1〜★5

JSONのみ出力

{
    "hook":"...",
    "difficulty":"★★☆☆☆"
}

タイトル:
${title}

Abstract:
${abstract}
`,
        });

    const raw =
        response.text
        ?.replace(/```json|```/g, "")
        .trim() ?? "{}";

    return Response.json(
        JSON.parse(raw)
    );
}