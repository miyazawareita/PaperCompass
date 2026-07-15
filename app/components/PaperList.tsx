"use client";

import { useState, useRef, useEffect } from "react";
import SummaryButton from "./SummaryButton";
import PaperCard from "./PaperCard";
import { categoryLabel } from "./utils";
import { loadBookmarks, saveBookmarks } from "../lib/bookmark";
import type { Author, Category, Paper, Bookmark } from "../types/Paper";


export default function PaperList({
    papers,
}: {
    papers: Paper[];
}) {
    const [selectedPaper, setSelectedPaper] =
        useState(papers[0]);

    const [selectedCategory, setSelectedCategory] =
        useState("ALL");

    const [displayPapers, setDisplayPapers] = useState<Paper[]>([]);

    const detaiRef = useRef<HTMLDivElement>(null);

    const [cathover, setCatHover] = useState<string | null>(null);
    const [shufhover, setShufHover] = useState(false);
    const [bookhover, setBookHover] = useState(false);
    const [bookmarkHover, setBookmarkHover] = useState<string | null>(null);

    const filteredPapers =
        selectedCategory === "ALL"
            ? papers
            : papers.filter((paper) =>
                paper.category?.some(
                    (cat: Category) =>
                        cat.$.term === selectedCategory
                )
            );

    const [bookmarks, setBookmarks] = useState<Paper[]>([]);

    function saveBookmark(paper: Paper) {

        const bookmarks = loadBookmarks();

        const exists = bookmarks.some(
            (p: Bookmark) =>
                p.id[0] === paper.id[0]
        );

        if (!exists) {

            const updated = [
                ...bookmarks,
                {
                    id: [paper.id[0]],
                    title: [paper.title[0]],
                    summary: [paper.summary[0]],
                    author: paper.author,
                    published: [paper.published[0]],
                    category: paper.category,
                },
            ];

            saveBookmarks(updated);
            setBookmarks(updated);
        }
    }

    function pickRandomPapers(
        papers: Paper[],
        count: number
    ) {
        const shuffled = [...papers].sort(
            () => Math.random() - 0.5
        );

        return shuffled.slice(0, count);
    }

    useEffect(() => {
        const bookmarks = loadBookmarks();
        setBookmarks(bookmarks);
    }, []);

    useEffect(() => {
        setDisplayPapers(pickRandomPapers(filteredPapers, 5));
    }, [selectedCategory, papers]);        

    return (
        <div>
            <h2>📄 今日の研究</h2>

            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                }}
            >
                {[
                    "ALL",
                    "cs.AI",
                    "cs.LG",
                    "cs.CL",
                    "cs.CV",
                ].map((category) => (
                    <button
                        key={category}
                        onClick={() =>
                            setSelectedCategory(category)
                        }
                        onMouseEnter={() => setCatHover(category)}
                        onMouseLeave={() => setCatHover(null)}
                        style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: "1px solid #ddd",
                            cursor: "pointer",
                            transition: "background-color 0.2s, color 0.2s",
                            backgroundColor:
                                selectedCategory === category
                                    ? "#2563eb"
                                    : cathover === category
                                        ? "#f8faff"
                                        : "white",
                            color:
                                selectedCategory === category
                                    ? "white"
                                    : "black",
                        }}
                    >
                        {category === "ALL"
                            ? "全部"
                            : categoryLabel(category)}
                    </button>
                ))}
            </div>

            <button
                onClick={() =>  {
                    setDisplayPapers(
                        pickRandomPapers(filteredPapers,5)
                    );
                }}
                onMouseEnter={() => setShufHover(true)}
                onMouseLeave={() => setShufHover(false)}
                style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    backgroundColor: shufhover ? "#f8faff" : "white",
                }}
            >
                🔄 論文をシャッフル
            </button>

            {displayPapers.map((paper) => (
                <PaperCard
                    key={paper.id[0]}
                    paper={paper}
                    selected={
                        selectedPaper.id?.[0] ===
                        paper.id?.[0]
                    }
                    onSelect={() => {
                        setSelectedPaper(paper);

                        setTimeout(() => {
                            detaiRef.current?.scrollIntoView({
                                behavior: "smooth",
                            });
                        }, 100);
                    }}
                />
            ))
            }

            <hr />

            <h2>📰 論文詳細</h2>

            <div
                ref={detaiRef}
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    padding: "20px",
                    marginTop: "20px",
                }}
            >

                <h3
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                    }}
                >
                    {selectedPaper.title[0]}
                </h3>

                

                <p>
                    📅 {selectedPaper.published?.[0]
                        ?.split("T")[0]}
                </p>

                <p>
                    著者：
                    {selectedPaper.author
                        .map(
                            (author: Author) =>
                                author.name[0]
                        )
                        .join(", ")}
                </p>

                <SummaryButton
                    abstract={selectedPaper.summary[0]}
                    paperId={selectedPaper.id[0]}
                />

                <button
                    onClick={() =>
                        saveBookmark(selectedPaper)
                    }
                    onMouseEnter={() => setBookHover(true)}
                    onMouseLeave={() => setBookHover(false)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                        backgroundColor: bookhover ? "#f8faff" : "white",
                    }}
                >
                    ⭐ 保存
                </button>

                <a
                    href={selectedPaper.id[0]}
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

                <h2
                    style={{
                        marginTop: "20px",
                        marginBottom: "10px",
                    }}
                >
                    ⭐ 保存した研究
                </h2>

                {bookmarks.map((bookmark) => (

                    <div
                        key={bookmark.id[0]}

                        onClick={() => {

                            setSelectedPaper(bookmark);

                            setTimeout(() => {
                                detaiRef.current
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    });
                            }, 100);
                        }
                        }
                        onMouseEnter={() => setBookmarkHover(bookmark.id[0])}
                        onMouseLeave={() => setBookmarkHover(null)}
                        style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            backgroundColor: bookmarkHover === bookmark.id[0] ? "#f8faff" : "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span>
                            {bookmark.title}
                        </span>

                        <button
                            onClick={(e) => {

                                e.stopPropagation();

                                const updated =
                                    bookmarks.filter(
                                        (b) =>
                                            b.id[0] !== bookmark.id[0]
                                    );

                                saveBookmarks(updated);

                                setBookmarks(updated);
                            }}
                            style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                fontSize: "18px",
                                backgroundColor: bookmarkHover === bookmark.id[0] ? "#f8faff" : "white",
                                transition: "background-color 0.2s, color 0.2s",
                            }}
                        >
                            ❌
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}