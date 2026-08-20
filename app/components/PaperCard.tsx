"use client";

import { useState } from "react";
import { categoryLabel, getDaysAgo } from "./utils";
import type { NormalizedPaper } from "../types/Paper";

export default function PaperCard({
    paper,
    selected,
    onSelect,
}: {
    paper: NormalizedPaper;
    selected: boolean;
    onSelect: () => void;
}) {
    const [hover, setHover] = useState(false);

    return (
        <div
            onClick={onSelect}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "12px",
                cursor: "pointer",
                transition: "background-color 0.2s",
                backgroundColor: selected
                    ? "#eff6ff"
                    : hover
                        ? "#f8faff"
                        : "white",
            }}
        >
            <p
                style={{
                    fontSize: "13px",
                    color: "#2563eb",
                    marginBottom: "12px",
                }}
            >
                {paper.categories.map(categoryLabel).join(" ・ ")}
            </p>

            <h3>{paper.title}</h3>

            <p style={{ marginTop: "15px", color: "#666" }}>
                {getDaysAgo(paper.published)}
            </p>
        </div>
    );
}
