import { generateExplanation } from "@/app/lib/gemini";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body || typeof body.abstract !== "string") {
            return Response.json(
                { error: "abstract は文字列である必要があります。" },
                { status: 400 }
            );
        }

        const abstract = body.abstract.trim();

        if (abstract.length === 0) {
            return Response.json(
                { error: "abstract は空にできません。" },
                { status: 400 }
            );
        }

        if (abstract.length > 10000) {
            return Response.json(
                { error: "abstract が長すぎます（10,000文字以内）。" },
                { status: 400 }
            );
        }

        const result = await generateExplanation(abstract);
        return Response.json(result);
    } catch (error) {
        console.error("Summarize API error:", error);
        return Response.json(
            {
                summary: "AI要約を生成できませんでした。",
                hook: "",
                difficulty: "",
                difficulty_reason: "",
                terms: [],
            },
            { status: 500 }
        );
    }
}
