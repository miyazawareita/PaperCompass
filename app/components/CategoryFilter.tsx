"use client";

import { categoryLabel } from "./utils";
import type { NormalizedPaper } from "../types/Paper";

const CATEGORIES = ["ALL", "cs.AI", "cs.LG", "cs.CL", "cs.CV"];

export default function CategoryFilter({
    papers,
    selected,
    onSelect,
}: {
    papers: NormalizedPaper[];
    selected: string;
    onSelect: (category: string) => void;
}) {
    function countOf(category: string) {
        return category === "ALL"
            ? papers.length
            : papers.filter((p) => p.categories.includes(category)).length;
    }

    return (
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="カテゴリで絞り込み">
            {CATEGORIES.map((category) => {
                const active = selected === category;
                return (
                    <button
                        key={category}
                        type="button"
                        onClick={() => onSelect(category)}
                        aria-pressed={active}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                            active
                                ? "border-accent bg-accent text-accent-fg"
                                : "border-line bg-surface text-muted hover:border-line-strong hover:text-foreground"
                        }`}
                    >
                        {category === "ALL" ? "すべて" : categoryLabel(category)}
                        <span
                            className={`text-xs tabular-nums ${active ? "opacity-80" : "text-subtle"}`}
                        >
                            {countOf(category)}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
