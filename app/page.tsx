import { parseStringPromise } from "xml2js";
import PaperList from "./components/PaperList";
import type { Paper } from "./types/Paper";

export default async function Home() {

    const response = await fetch(
        "https://arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=500&sortBy=submittedDate&sortOrder=descending",
        { cache: "no-store" }
    );

    const xml = await response.text();

    if (!xml.includes("<feed")) {
    console.log(xml);
    throw new Error("arXiv API error");
}

    const result = await parseStringPromise(xml);

    const papers = result.feed.entry;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(
        oneWeekAgo.getDate() - 7
    );

    const recentPapers = papers.filter(
        (paper: Paper) => {
            const published = new Date(
                paper.published[0]
            );

            return published >= oneWeekAgo;
        }
    );

    return (
        <main>
            <h1>PaperCompass</h1>

            <PaperList papers={recentPapers} />
        </main>
    );
}