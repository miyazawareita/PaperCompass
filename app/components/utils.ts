import type { Paper, NormalizedPaper } from "../types/Paper";

// arXivのタイトル・Abstractは改行や連続スペースを含むので1行に整える
function collapseWhitespace(text: string) {
    return text.replace(/\s+/g, " ").trim();
}

export function formatAuthors(authors: string[], max = 3) {
    if (authors.length <= max) return authors.join(", ");
    return `${authors.slice(0, max).join(", ")} 他${authors.length - max}名`;
}

export function arxivIdFromUrl(url: string) {
    return url.split("/abs/")[1] ?? url;
}

export function normalizePaper(paper: Paper): NormalizedPaper {
    return {
        id: paper.id[0],
        title: collapseWhitespace(paper.title[0]),
        summary: collapseWhitespace(paper.summary[0]),
        published: paper.published[0],
        authors: paper.author.map((a) => a.name[0]),
        categories: paper.category.map((c) => c.$.term),
    };
}

export function formatCategories(categories: string[]) {
    return categories;
}

export function categoryLabel(term: string) {
    const map: Record<string, string> = {
        "cs.AI": "🧠 AI",
        "cs.LG": "🤖 機械学習",
        "cs.CL": "💬 自然言語処理",
        "cs.CV": "👁️ コンピュータビジョン",
        "cs.RO": "🦾 ロボット工学",
        "eess.SP": "📡 信号処理",
        "cs.IR": "🔍 情報検索",
        "cs.CR": "🔒 セキュリティ",
        "cs.DB": "🗄️ データベース",
        "cs.SE": "💻 ソフトウェア工学",
        "cs.NE": "🧬 ニューラルネットワーク",
        "cs.HC": "👤 HCI",
        "cs.MA": "🤝 マルチエージェント",
        "cs.DC": "☁️ 分散システム",
    };

    return map[term] ?? term;
}

export function getDaysAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);

    const diff = Math.floor(
        (now.getTime() - date.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (diff === 0) return "🆕 今日";
    if (diff === 1) return "📅 1日前";

    return `📅 ${diff}日前`;
}
