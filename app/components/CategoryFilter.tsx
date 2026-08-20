"use client";

import { useState } from "react";
import { categoryLabel } from "./utils";

const CATEGORIES = ["ALL", "cs.AI", "cs.LG", "cs.CL", "cs.CV"];

export default function CategoryFilter({
    selected,
    onSelect,
}: {
    selected: string;
    onSelect: (category: string) => void;
}) {
    const [hover, setHover] = useState<string | null>(null);

    return (
        <div
            style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "20px",
            }}
        >
            {CATEGORIES.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelect(category)}
                    onMouseEnter={() => setHover(category)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                        transition: "background-color 0.2s, color 0.2s",
                        backgroundColor:
                            selected === category
                                ? "#2563eb"
                                : hover === category
                                    ? "#f8faff"
                                    : "white",
                        color:
                            selected === category ? "white" : "black",
                    }}
                >
                    {category === "ALL"
                        ? "全部"
                        : categoryLabel(category)}
                </button>
            ))}
        </div>
    );
}
