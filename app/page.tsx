import { parseStringPromise } from "xml2js";
import SummaryButton from "./components/SummaryButton";

export default async function Home() {

    const response = await fetch(
        "https://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=5"
    );

    const xml = await response.text();

    const result = await parseStringPromise(xml);

    const papers = result.feed.entry;

    const firstPaper = papers[0];

    

    // console.log(resultData);

    return (
        <main>
            <h1>論文Duolingo</h1>

            <SummaryButton
                abstract={firstPaper.summary[0]}
            />

            <h2>今日の論文</h2>

            <h3>{firstPaper.title[0]}</h3>

            <p>
                著者：
                {firstPaper.author
                    .map((author: any) => author.name[0])
                    .join(", ")}
            </p>

            <p style={{ whiteSpace: "pre-wrap" }}>
                {firstPaper.summary[0]}
            </p>
        </main>
    );
}