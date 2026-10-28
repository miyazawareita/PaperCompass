import { generateExplanation, GeminiError } from "@/app/lib/gemini";
import { fetchPaperById, isValidArxivId } from "@/app/lib/arxiv";

// 任意の文章ではなくarXiv IDだけを受け取り、Abstractはサーバー側で取得する。
// これでこのAPIが「誰でも使えるGeminiの中継」として悪用されるのを防ぐ。
export async function POST(request: Request) {
    let id: unknown;
    try {
        ({ id } = await request.json());
    } catch {
        return Response.json({ error: "リクエストの形式が不正です。" }, { status: 400 });
    }

    if (typeof id !== "string" || !isValidArxivId(id)) {
        return Response.json({ error: "arXiv ID が不正です。" }, { status: 400 });
    }

    try {
        const paper = await fetchPaperById(id);
        if (!paper) {
            return Response.json({ error: "論文が見つかりませんでした。" }, { status: 404 });
        }

        const result = await generateExplanation(id, paper.summary);
        return Response.json(result);
    } catch (error) {
        if (error instanceof GeminiError) {
            return Response.json({ error: error.message }, { status: error.status });
        }
        console.error("Summarize API error:", error);
        return Response.json({ error: "AI解説の生成に失敗しました。" }, { status: 500 });
    }
}
