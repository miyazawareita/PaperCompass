"use client";

import SummaryButton from "./SummaryButton";
import { BookmarkIcon, ChevronIcon, ExternalIcon, FileIcon } from "./Icons";
import { arxivIdFromUrl, categoryLabel, formatAuthors } from "./utils";
import type { NormalizedPaper } from "../types/Paper";

export default function PaperDetail({
    paper,
    bookmarked,
    onToggleBookmark,
}: {
    paper: NormalizedPaper;
    bookmarked: boolean;
    onToggleBookmark: (paper: NormalizedPaper) => void;
}) {
    return (
        <article
            aria-labelledby="detail-title"
            className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
        >
            <div className="border-b border-line p-5 sm:p-7">
                <div className="flex flex-wrap gap-1.5">
                    {paper.categories.map((c) => (
                        <span
                            key={c}
                            className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent"
                        >
                            {categoryLabel(c)}
                        </span>
                    ))}
                </div>

                <h2
                    id="detail-title"
                    className="mt-3 text-xl font-bold leading-snug tracking-tight sm:text-2xl"
                >
                    {paper.title}
                </h2>

                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                    <dt className="text-subtle">公開日</dt>
                    <dd className="text-muted">{paper.published.split("T")[0]}</dd>
                    <dt className="text-subtle">著者</dt>
                    <dd className="text-muted">{formatAuthors(paper.authors)}</dd>
                    <dt className="text-subtle">arXiv</dt>
                    <dd className="font-mono text-muted">{arxivIdFromUrl(paper.id)}</dd>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                    <a
                        href={paper.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
                    >
                        arXivで読む
                        <ExternalIcon className="size-4" />
                    </a>
                    <a
                        href={paper.id.replace("/abs/", "/pdf/")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-surface-muted"
                    >
                        <FileIcon className="size-4" />
                        PDF
                    </a>
                    <button
                        type="button"
                        onClick={() => onToggleBookmark(paper)}
                        aria-pressed={bookmarked}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                            bookmarked
                                ? "border-accent bg-accent-soft text-accent"
                                : "border-line hover:border-line-strong hover:bg-surface-muted"
                        }`}
                    >
                        <BookmarkIcon className="size-4" filled={bookmarked} />
                        {bookmarked ? "保存済み" : "保存する"}
                    </button>
                </div>
            </div>

            <div className="p-5 sm:p-7">
                <SummaryButton
                    key={paper.id}
                    arxivId={arxivIdFromUrl(paper.id)}
                />
            </div>

            <details className="group border-t border-line">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-muted hover:text-foreground sm:px-7">
                    原文のAbstract（英語）
                    <ChevronIcon className="size-4 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-6 text-sm leading-relaxed text-muted sm:px-7">
                    {paper.summary}
                </p>
            </details>
        </article>
    );
}
