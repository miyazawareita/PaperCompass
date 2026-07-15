import type { Category } from "../types/Paper";

export function formatCategories(categories: Category[]) {
    if (!categories) return [];

    return categories.map((c) => c.$.term);
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