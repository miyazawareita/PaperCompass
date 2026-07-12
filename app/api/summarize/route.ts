import { generateExplanation } from "@/app/lib/gemini";

export async function POST(request: Request) {
    try {
        const { abstract } = await request.json();

        const result = await generateExplanation(
            abstract
        );

        return Response.json(result);

    } catch (error) {
        console.error(error);

        return Response.json(
            {
                summary:
                    "AI要約を生成できませんでした。",
                terms: [],
            },
            {
                status: 500,
            }
        );
    }
}