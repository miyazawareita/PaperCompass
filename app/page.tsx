import { GoogleGenAI } from "@google/genai";
import { parseStringPromise } from "xml2js";

export default async function Home() {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY!,
    });

    const response = await fetch(
        "https://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=5"
    );

    const xml = await response.text();

    const result = await parseStringPromise(xml);

    const papers = result.feed.entry;

    const firstPaper = papers[0];

    const responseGemini = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
    以下の論文Abstractを、
    情報系学部4年生向けに、
    日本語で3行程度に要約してください。

    ${firstPaper.summary[0]}
    `,
    });

    const summary = responseGemini.text;

    const quizResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
    以下の論文Abstractをもとに、
    情報系学部4年生向けの4択問題を1問作成してください。

    以下の形式を厳守してください。

    Q. 問題文

    A. 選択肢
    B. 選択肢
    C. 選択肢
    D. 選択肢

    正解: ○

    解説:
    ○○○○○○

    Abstract:
    ${firstPaper.summary[0]}
    `,
    });

    const quiz = quizResponse.text;

    return (
        <main>
            <h1>論文Duolingo</h1>

            <h2>今日のAI要約</h2>

            <p>{summary}</p>

            <h2>🧠 理解度チェック</h2>

            <p style={{ whiteSpace: "pre-wrap" }}>
                {quiz}
            </p>

            <h2>今日の論文</h2>

            <ul style={{ listStyleType: "disc", paddingLeft: "20px"}}>
                {papers.map((paper: any) => (
                    <li key={paper.id[0]} style={{ marginBottom: "30px"}}>
                        <h3>{paper.title[0]}</h3>

                        <p>
                            著者：
                            {paper.author.map((author: any) => author.name[0]).join(", ")}
                        </p>

                        <p style={{ whiteSpace: "pre-wrap" }}>
                            {paper.summary[0]}
                        </p>
                    </li>
                ))}
            </ul>
        </main>
    );
}