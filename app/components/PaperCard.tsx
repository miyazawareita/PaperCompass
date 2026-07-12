"use client";

import {
    formatCategories,
    categoryLabel,
    getDaysAgo,
    getReadingTime,
} from "./utils";
import type { Paper } from "../types/Paper";

export default function SummaryButton({
    paper,
    selected,
    onSelect,
}: {
    paper: Paper;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <div
            onClick={onSelect}
            style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "12px",
                cursor: "pointer",
                backgroundColor: selected
                    ? "#eff6ff"
                    : "white",
            }}
        >

            <p style={{ fontSize: "13px", color: "#2563eb" }}>
                {formatCategories(paper.category)
                    .map(categoryLabel)
                    .join(" ・ ")}
            </p>

            <h3>{paper.title[0]}</h3>

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
    );
}