import { unstable_cache } from "next/cache";
import { parseStringPromise } from "xml2js";
import type { Paper, NormalizedPaper } from "../types/Paper";
import { normalizePaper } from "../components/utils";

export const MAX_RESULTS = 500;

const API_BASE = "https://export.arxiv.org/api/query";

const RECENT_URL =
    `${API_BASE}?search_query=cat:cs.AI&start=0&max_results=${MAX_RESULTS}&sortBy=submittedDate&sortOrder=descending`;

// arXiv IDの形式（新形式 2501.01234v2 / 旧形式 cs/0101001v1）
const ARXIV_ID_PATTERN = /^(\d{4}\.\d{4,5}|[a-z-]+(\.[A-Z]{2})?\/\d{7})(v\d+)?$/;

export function isValidArxivId(id: string) {
    return ARXIV_ID_PATTERN.test(id);
}

async function fetchFeed(url: string): Promise<Paper[]> {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(`arXiv API returned ${response.status}`);
    }

    const xml = await response.text();

    if (!xml.includes("<feed")) {
        throw new Error("arXiv API returned invalid response");
    }

    const result = await parseStringPromise(xml);
    return result.feed.entry ?? [];
}

async function fetchRecentPapersUncached(): Promise<NormalizedPaper[]> {
    const papers = await fetchFeed(RECENT_URL);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return papers
        .filter((paper) => new Date(paper.published[0]) >= oneWeekAgo)
        .map(normalizePaper);
}

// Vercelでは複数のインスタンスで共有されるData Cacheに10分間保存する
// （インスタンスごとのメモリキャッシュだとarXivへのアクセスが減らないため）
export const fetchRecentPapers = unstable_cache(
    fetchRecentPapersUncached,
    ["arxiv-recent-cs-ai"],
    { revalidate: 600 }
);

export async function fetchPaperById(id: string): Promise<NormalizedPaper | null> {
    const recent = await fetchRecentPapers().catch(() => []);
    const hit = recent.find((p) => p.id.endsWith(`/abs/${id}`));
    if (hit) return hit;

    // 先週以前にブックマークした論文などは個別に取得する
    const papers = await fetchFeed(`${API_BASE}?id_list=${encodeURIComponent(id)}`);
    const paper = papers.find((p) => p.id?.[0] && p.summary?.[0]);
    return paper ? normalizePaper(paper) : null;
}
