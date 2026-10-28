"use client";

import { categoryLabel, formatAuthors, getDaysAgo } from "./utils";
import { BookmarkIcon } from "./Icons";
import type { NormalizedPaper } from "../types/Paper";

const MAX_CATEGORIES = 3;

export default function PaperCard({
    paper,
    selected,
    bookmarked,
    onSelect,
}: {
    paper: NormalizedPaper;
    selected: boolean;
    bookmarked: boolean;
    onSelect: () => void;
}) {
    const extraCategories = paper.categories.length - MAX_CATEGORIES;

    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={`block w-full rounded-xl border p-4 text-left transition-all sm:p-5 ${
                selected
                    ? "border-accent bg-accent-soft shadow-sm ring-1 ring-accent"
                    : "border-line bg-surface hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md"
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                    {paper.categories.slice(0, MAX_CATEGORIES).map((c) => (
                        <span
                            key={c}
                            className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted"
                        >
                            {categoryLabel(c)}
                        </span>
                    ))}
                    {extraCategories > 0 && (
                        <span className="px-1 py-0.5 text-xs text-subtle">
                            +{extraCategories}
                        </span>
                    )}
                </div>
                <span className="shrink-0 whitespace-nowrap text-xs text-subtle">
                    {getDaysAgo(paper.published)}
                </span>
            </div>

            <h3 className="mt-3 font-semibold leading-snug">{paper.title}</h3>

            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                {paper.summary}
            </p>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-subtle">
                <span className="truncate">{formatAuthors(paper.authors, 2)}</span>
                {bookmarked && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-accent">
                        <BookmarkIcon className="size-3.5" filled />
                        保存済み
                    </span>
                )}
            </div>
        </button>
    );
}
