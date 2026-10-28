"use client";

import { useState, useRef, useMemo } from "react";
import CategoryFilter from "./CategoryFilter";
import PaperCard from "./PaperCard";
import PaperDetail from "./PaperDetail";
import BookmarkList from "./BookmarkList";
import { ShuffleIcon } from "./Icons";
import { useBookmarks } from "../lib/bookmark";
import type { NormalizedPaper } from "../types/Paper";

const DISPLAY_COUNT = 5;

// シード付き乱数（mulberry32）。サーバーとクライアントで同じ並びになる
function seededRandom(seed: number) {
    let a = seed;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function pickRandomPapers(papers: NormalizedPaper[], count: number, seed: number) {
    const random = seededRandom(seed);
    const shuffled = [...papers];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

export default function PaperList({
    papers,
    seed,
}: {
    papers: NormalizedPaper[];
    seed: number;
}) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [shuffleKey, setShuffleKey] = useState(0);
    const [bookmarks, setBookmarks] = useBookmarks();
    const detailRef = useRef<HTMLDivElement>(null);

    const filteredPapers = useMemo(
        () =>
            selectedCategory === "ALL"
                ? papers
                : papers.filter((p) => p.categories.includes(selectedCategory)),
        [papers, selectedCategory]
    );

    const displayPapers = useMemo(
        () => pickRandomPapers(filteredPapers, DISPLAY_COUNT, seed + shuffleKey),
        [filteredPapers, seed, shuffleKey]
    );

    const selectedPaper =
        papers.find((p) => p.id === selectedId) ??
        bookmarks.find((b) => b.id === selectedId) ??
        displayPapers[0] ??
        null;

    const bookmarkedIds = new Set(bookmarks.map((b) => b.id));

    function selectPaper(id: string) {
        setSelectedId(id);
        // 2カラム表示では詳細が常に見えているので、1カラムのときだけスクロールする
        if (window.matchMedia("(max-width: 1023px)").matches) {
            requestAnimationFrame(() => {
                detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    }

    function handleToggleBookmark(paper: NormalizedPaper) {
        setBookmarks((prev) =>
            prev.some((b) => b.id === paper.id)
                ? prev.filter((b) => b.id !== paper.id)
                : [...prev, paper]
        );
    }

    function handleDeleteBookmark(id: string) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }

    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start lg:gap-10">
            <section aria-labelledby="picks-heading">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 id="picks-heading" className="text-lg font-semibold">
                        今週のピックアップ
                    </h2>
                    <button
                        type="button"
                        onClick={() => setShuffleKey((k) => k + 1)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-line-strong hover:text-foreground"
                    >
                        <ShuffleIcon className="size-4" />
                        別の5本を見る
                    </button>
                </div>

                <CategoryFilter
                    papers={papers}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                />

                {displayPapers.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-line-strong p-8 text-center text-sm text-muted">
                        このカテゴリの論文は今週ありませんでした。
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {displayPapers.map((paper) => (
                            <li key={paper.id}>
                                <PaperCard
                                    paper={paper}
                                    selected={selectedPaper?.id === paper.id}
                                    bookmarked={bookmarkedIds.has(paper.id)}
                                    onSelect={() => selectPaper(paper.id)}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                <BookmarkList
                    bookmarks={bookmarks}
                    selectedId={selectedPaper?.id ?? null}
                    onSelect={(b) => selectPaper(b.id)}
                    onDelete={handleDeleteBookmark}
                />
            </section>

            <div
                ref={detailRef}
                className="scroll-mt-20 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:rounded-2xl"
            >
                {selectedPaper && (
                    <PaperDetail
                        paper={selectedPaper}
                        bookmarked={bookmarkedIds.has(selectedPaper.id)}
                        onToggleBookmark={handleToggleBookmark}
                    />
                )}
            </div>
        </div>
    );
}
