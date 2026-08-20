"use client";

import { useState, useRef, useMemo } from "react";
import CategoryFilter from "./CategoryFilter";
import PaperCard from "./PaperCard";
import PaperDetail from "./PaperDetail";
import { useBookmarks } from "../lib/bookmark";
import type { NormalizedPaper } from "../types/Paper";

function pickRandomPapers(papers: NormalizedPaper[], count: number) {
    const shuffled = [...papers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

export default function PaperList({ papers }: { papers: NormalizedPaper[] }) {
    const [selectedPaper, setSelectedPaper] = useState(papers[0]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [bookmarks, setBookmarks] = useBookmarks();
    const detailRef = useRef<HTMLDivElement>(null);

    const filteredPapers = useMemo(
        () =>
            selectedCategory === "ALL"
                ? papers
                : papers.filter((p) => p.categories.includes(selectedCategory)),
        [papers, selectedCategory]
    );

    const [shuffleKey, setShuffleKey] = useState(0);

    const shuffledDisplayPapers = useMemo(
        () => pickRandomPapers(filteredPapers, 5),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filteredPapers, shuffleKey]
    );

    function scrollToDetail() {
        setTimeout(() => {
            detailRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }

    function handleBookmark(paper: NormalizedPaper) {
        setBookmarks((prev) => {
            if (prev.some((b) => b.id === paper.id)) return prev;
            return [...prev, paper];
        });
    }

    function handleDeleteBookmark(id: string) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }

    return (
        <div>
            <h2>📄 今日の研究</h2>

            <CategoryFilter
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />

            <button
                onClick={() => setShuffleKey((k) => k + 1)}
                style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                }}
            >
                🔄 論文をシャッフル
            </button>

            {shuffledDisplayPapers.map((paper) => (
                <PaperCard
                    key={paper.id}
                    paper={paper}
                    selected={selectedPaper.id === paper.id}
                    onSelect={() => {
                        setSelectedPaper(paper);
                        scrollToDetail();
                    }}
                />
            ))}

            <PaperDetail
                paper={selectedPaper}
                bookmarks={bookmarks}
                onBookmark={handleBookmark}
                onDeleteBookmark={handleDeleteBookmark}
                onSelectBookmark={(b) => {
                    setSelectedPaper(b);
                    scrollToDetail();
                }}
                detailRef={detailRef}
            />
        </div>
    );
}
