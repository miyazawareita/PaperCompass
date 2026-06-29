"use client";

import { useState, useRef, useEffect } from "react";
import SummaryButton from "./SummaryButton";
import AbstractSection from "./AbstractSection";

function formatCategories(categories: any[]) {
    if (!categories) return [];

    return categories.map((c) => c.$.term);
}

function categoryLabel(term: string) {
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

function getReadingTime(text: string) {
    const words = text.split(/\s+/).length;

    if (words < 150) {
        return "🟢 1〜2分";
    }

    if (words < 300) {
        return "🟡 3〜5分";
    }

    return "🔴 5分以上";
}

function getDaysAgo(dateString: string) {
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

export default function PaperList({
    papers,
}: {
    papers: any[];
}) {
    const [selectedPaper, setSelectedPaper] =
        useState(papers[0]);

    const [selectedCategory, setSelectedCategory] =
        useState("ALL");

    const [cardInfo, setCardInfo] =
        useState<Record<string, any>>({});

    const detaiRef = useRef<HTMLDivElement>(null);

    const filteredPapers =
        selectedCategory === "ALL"
            ? papers
            : papers.filter((paper) =>
                paper.category?.some(
                    (cat: any) =>
                        cat.$.term === selectedCategory
                )
            );

    const [bookmarks, setBookmarks] = useState<any[]>([]);

    function saveBookmark(paper: any) {

        const bookmarks = JSON.parse(
            localStorage.getItem("bookmarks")
            || "[]"
        );

        const exists = bookmarks.some(
            (p: any) =>
                p.id === paper.id[0]
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

            localStorage.setItem(
                "bookmarks",
                JSON.stringify(updated)
            );

            setBookmarks(updated);
        }
    }

    useEffect(() => {

        filteredPapers.forEach(
            async (paper) => {

                const paperId =
                    paper.id[0];

                const cache =
                    localStorage.getItem(
                        `card-${paperId}`
                    );

                if (cache) {

                    setCardInfo(
                        prev => ({
                            ...prev,
                            [paperId]:
                            JSON.parse(cache),
                        })
                    );

                    return;
                }

                const response =
                    await fetch(
                        "/api/card-info",
                        {
                            method:"POST",
                            headers:{
                                "Content-Type":
                                "application/json",
                            },
                            body:
                            JSON.stringify({
                                title:
                                paper.title[0],

                                abstract:
                                paper.summary[0],
                            }),
                        }
                    );

                const data =
                    await response.json();

                localStorage.setItem(
                    `card-${paperId}`,
                    JSON.stringify(data)
                );

                setCardInfo(
                    prev => ({
                        ...prev,
                        [paperId]: data,
                    })
                );
            }
        );

    }, [filteredPapers]);

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
                        style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: "1px solid #ddd",
                            backgroundColor:
                                selectedCategory === category
                                    ? "#2563eb"
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

            {filteredPapers.map((paper) => (
                <div
                    key={paper.id[0]}
                    onClick={() => {
                        setSelectedPaper(paper);

                        setTimeout(() => {
                            detaiRef.current?.scrollIntoView({
                                behavior: "smooth",
                            });
                        }, 100);
                    }}

                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "12px",
                        padding: "15px",
                        marginBottom: "12px",
                        cursor: "pointer",
                        backgroundColor:
                            selectedPaper.id?.[0] ===
                            paper.id?.[0]
                                ? "#eff6ff"
                                : "white",
                    }}
                >

                    <p style={{ fontSize: "13px", color: "#2563eb" }}>
                        {formatCategories(paper.category)
                            .map(categoryLabel)
                            .join(" ・ ")}
                    </p>
                
                    <h3
                        style={{
                            marginTop: 0,
                            marginBottom: "10px",
                            fontSize: "18px",
                        }}
                    >
                        {paper.title[0]}
                    </h3>

                    {cardInfo[
                        paper.id[0]
                    ]?.hook && (

                        <p
                            style={{
                                color:"#555",
                                marginTop:"8px",
                            }}
                        >
                            💡 {
                                cardInfo[
                                    paper.id[0]
                                ].hook
                            }
                        </p>
                    )}

                    {cardInfo[
                        paper.id[0]
                    ]?.difficulty && (

                        <p
                            style={{
                                color:"#666",
                                fontSize:"14px",
                            }}
                        >
                            {
                                cardInfo[
                                    paper.id[0]
                                ].difficulty
                            }
                        </p>
                    )}

                    {
                        typeof window !== "undefined" &&
                        localStorage.getItem(
                        `summary-${paper.id[0]}`
                        ) && (
                            <p
                                style={{
                                    color: "green",
                                    fontSize: "12px",
                                }}
                            >
                                ✓ AI解説済み
                            </p>
                        )
                    }

                    <p
                        style={{
                            margin: "5px 0",
                            color: "#666",
                        }}
                    >
                        {getDaysAgo(
                            paper.published[0]
                        )}
                    </p>

                    <p
                        style={{
                            margin: "5px 0",
                            color: "#666",
                        }}
                    >
                        {getReadingTime(
                            paper.summary[0]
                     )}
                    </p>
                </div>
            ))}

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

                <h3>
                    {selectedPaper.title[0]}
                </h3>

                <button
                    onClick={() =>
                        saveBookmark(selectedPaper)
                    }
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
                    href={selectedPaper.id[0]}
                    target="_blank"
                >   
                    arXivで読む →
                </a>

                <p>
                    📅 {selectedPaper.published?.[0]
                        ?.split("T")[0]}
                </p>

                <p>
                    著者：
                    {selectedPaper.author
                        .map(
                            (author: any) =>
                                author.name[0]
                        )
                        .join(", ")}
                </p>

                <SummaryButton
                    abstract={selectedPaper.summary[0]}
                    paperId={selectedPaper.id[0]}
                />

                <AbstractSection
                    abstract={selectedPaper.summary[0]}
                />

                <h2>⭐ 保存した研究</h2>

                {bookmarks.map((bookmark) => (

                    <div
                        key={bookmark.id}

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

                        style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "8px",
                            cursor: "pointer",

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
                                            b.id !== bookmark.id
                                    );

                                localStorage.setItem(
                                    "bookmarks",
                                    JSON.stringify(updated)
                                );

                                setBookmarks(updated);
                            }}
                            style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                fontSize: "18px",
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