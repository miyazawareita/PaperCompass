"use client";

import { useState } from "react";
import type { Bookmark } from "../types/Paper";

export default function BookmarkList({
    bookmarks,
    onSelect,
    onDelete,
}: {
    bookmarks: Bookmark[];
    onSelect: (bookmark: Bookmark) => void;
    onDelete: (id: string) => void;
}) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div>
            <h2 style={{ marginTop: "20px", marginBottom: "10px" }}>
                ⭐ 保存した研究
            </h2>

            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    onClick={() => onSelect(bookmark)}
                    onMouseEnter={() => setHoveredId(bookmark.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor:
                            hoveredId === bookmark.id ? "#f8faff" : "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>{bookmark.title}</span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(bookmark.id);
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
    );
}
