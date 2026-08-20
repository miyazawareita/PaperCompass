import { parseStringPromise } from "xml2js";
import PaperList from "./components/PaperList";
import type { Paper, NormalizedPaper } from "./types/Paper";
import { normalizePaper } from "./components/utils";
import { arxivCache } from "./lib/cache";

export const dynamic = "force-dynamic";

const ARXIV_URL =
    "https://arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=500&sortBy=submittedDate&sortOrder=descending";

async function fetchRecentPapers(): Promise<NormalizedPaper[]> {
    const cached = arxivCache.get("recent");
    if (cached) {
        return JSON.parse(cached) as NormalizedPaper[];
    }

    const response = await fetch(ARXIV_URL, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(`arXiv API returned ${response.status}`);
    }

    const xml = await response.text();

    if (!xml.includes("<feed")) {
        throw new Error("arXiv API returned invalid response");
    }

    const result = await parseStringPromise(xml);
    const papers: Paper[] = result.feed.entry ?? [];

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentPapers = papers
        .filter((paper) => new Date(paper.published[0]) >= oneWeekAgo)
        .map(normalizePaper);

    arxivCache.set("recent", JSON.stringify(recentPapers));

    return recentPapers;
}

export default async function Home() {
    let recentPapers: NormalizedPaper[] = [];

    try {
        recentPapers = await fetchRecentPapers();
    } catch (error) {
        console.error("Failed to fetch papers:", error);
    }

    return (
        <main>
            <h1>PaperCompass</h1>

            {recentPapers.length === 0 ? (
                <p style={{ color: "#666", marginTop: "20px" }}>
                    論文を取得できませんでした。しばらくしてからもう一度お試しください。
                </p>
            ) : (
                <PaperList papers={recentPapers} />
            )}
        </main>
    );
}
