"use client";

import SummaryButton from "./SummaryButton";
import BookmarkList from "./BookmarkList";
import type { NormalizedPaper, Bookmark } from "../types/Paper";

export default function PaperDetail({
    paper,
    bookmarks,
    onBookmark,
    onDeleteBookmark,
    onSelectBookmark,
    detailRef,
}: {
    paper: NormalizedPaper;
    bookmarks: Bookmark[];
    onBookmark: (paper: NormalizedPaper) => void;
    onDeleteBookmark: (id: string) => void;
    onSelectBookmark: (bookmark: Bookmark) => void;
    detailRef: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <div>
            <hr />
            <h2>📰 論文詳細</h2>

            <div
                ref={detailRef}
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    padding: "20px",
                    marginTop: "20px",
                }}
            >
                <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {paper.title}
                </h3>

                <p>📅 {paper.published.split("T")[0]}</p>

                <p>著者：{paper.authors.join(", ")}</p>

                <SummaryButton
                    key={paper.id}
                    abstract={paper.summary}
                    paperId={paper.id}
                />

                <button
                    onClick={() => onBookmark(paper)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                    }}
                >
                    ⭐ 保存
                </button>

                <a
                    href={paper.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "#2563eb",
                        textDecoration: "none",
                        fontWeight: "bold",
                    }}
                >
                    📄 arXivで全文を読む ↗
                </a>

                <BookmarkList
                    bookmarks={bookmarks}
                    onSelect={onSelectBookmark}
                    onDelete={onDeleteBookmark}
                />
            </div>
        </div>
    );
}
