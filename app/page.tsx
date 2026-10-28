import PaperList from "./components/PaperList";
import type { NormalizedPaper } from "./types/Paper";
import { fetchRecentPapers, MAX_RESULTS } from "./lib/arxiv";

// シャッフル用のシードをリクエストごとに変えるため動的レンダリングにする
// （arXivのデータ自体は lib/arxiv.ts で10分間キャッシュされる）
export const dynamic = "force-dynamic";

// サーバーで決めたシードをクライアントに渡し、ランダム表示をハイドレーションと一致させる
function createShuffleSeed() {
    return Math.floor(Math.random() * 2 ** 31);
}

export default async function Home() {
    let recentPapers: NormalizedPaper[] = [];

    try {
        recentPapers = await fetchRecentPapers();
    } catch (error) {
        console.error("Failed to fetch papers:", error);
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
            <section className="pt-10 pb-8 sm:pt-14 sm:pb-10">
                <p className="text-sm font-medium text-accent">
                    arXiv cs.AI ・ 直近7日間の新着
                </p>
                <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                    今週読む論文を、
                    <br className="sm:hidden" />
                    5本から選ぼう。
                </h1>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                    最新のAI論文からランダムに5本をピックアップ。気になる論文を選ぶと、AIが日本語の要約・難易度・重要キーワードを解説します。
                </p>
                {recentPapers.length > 0 && (
                    <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm text-muted">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        今週の新着論文
                        <strong className="font-semibold text-foreground">
                            {recentPapers.length}本
                            {recentPapers.length >= MAX_RESULTS && "以上"}
                        </strong>
                    </p>
                )}
            </section>

            {recentPapers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-10 text-center">
                    <p className="font-semibold">論文を取得できませんでした</p>
                    <p className="mt-2 text-sm text-muted">
                        arXivへの接続に失敗しました。しばらくしてからもう一度お試しください。
                    </p>
                </div>
            ) : (
                <PaperList papers={recentPapers} seed={createShuffleSeed()} />
            )}
        </main>
    );
}
