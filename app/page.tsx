import { parseStringPromise } from "xml2js";
import SummaryButton from "./components/SummaryButton";
import PaperList from "./components/PaperList";

export default async function Home() {

    const response = await fetch(
        "https://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=500&sortBy=submittedDate&sortOrder=descending"
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
        (paper: any) => {
            const published = new Date(
                paper.published[0]
            );

            return published >= oneWeekAgo;
        }
    );

    const shuffled = [...recentPapers].sort(
        () => Math.random() - 0.5
    );

    const papersToShow = shuffled.slice(0, 5);

    return (
        <main>
            <h1>論文Duolingo</h1>

            <PaperList papers={papersToShow} />
        </main>
    );
}