"use client";

import { useState } from "react";
import TermCard from "./TermCard";
import { SparkleIcon } from "./Icons";
import type { Term, SummaryResult } from "../types/SummaryResult";

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-subtle">
            {children}
        </h3>
    );
}

// v2: 失敗時の結果までキャッシュしていた旧形式（summary-<url>）を読まないようにキーを変更
const cacheKey = (arxivId: string) => `summary-v2-${arxivId}`;

export default function SummaryButton({ arxivId }: { arxivId: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SummaryResult | null>(null);

    async function handleClick() {
        const cache = localStorage.getItem(cacheKey(arxivId));
        if (cache) {
            setResult(JSON.parse(cache));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: arxivId }),
            });
            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setError(data?.error ?? "AI解説の生成に失敗しました。もう一度お試しください。");
                return;
            }

            setResult(data);
            localStorage.setItem(cacheKey(arxivId), JSON.stringify(data));
        } catch {
            setError("通信に失敗しました。ネットワークを確認してもう一度お試しください。");
        } finally {
            setLoading(false);
        }
    }

    if (!result) {
        return (
            <div>
                <div className="flex flex-col gap-4 rounded-xl border border-dashed border-line-strong bg-surface-muted p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-semibold">AI解説で、読むべきか判断する</p>
                        <p className="mt-1 text-sm text-muted">
                            日本語要約・難易度・重要キーワードを生成します
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={loading}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <SparkleIcon className="size-4" />
                        {loading ? "生成中…" : "AI解説を生成"}
                    </button>
                </div>

                {loading && (
                    <div className="mt-6 space-y-3" aria-hidden>
                        <div className="skeleton h-16" />
                        <div className="skeleton h-4 w-1/3" />
                        <div className="skeleton h-4" />
                        <div className="skeleton h-4 w-5/6" />
                        <div className="skeleton h-4 w-2/3" />
                    </div>
                )}

                {error && (
                    <p role="alert" className="mt-4 text-sm text-danger">
                        {error}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                <SparkleIcon className="size-4" />
                AI解説
            </p>

            {result.hook && (
                <div className="rounded-xl border-l-4 border-warm bg-warm-soft p-4">
                    <p className="text-xs font-semibold text-warm">なぜ読む？</p>
                    <p className="mt-1 font-medium leading-relaxed">{result.hook}</p>
                </div>
            )}

            {result.difficulty && (
                <section>
                    <SectionLabel>難易度（学部4年生基準）</SectionLabel>
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-lg tracking-widest text-star">
                            {result.difficulty}
                        </span>
                        <span className="text-sm text-muted">
                            {result.difficulty_reason}
                        </span>
                    </p>
                </section>
            )}

            <section>
                <SectionLabel>要約</SectionLabel>
                <p className="whitespace-pre-wrap leading-relaxed">{result.summary}</p>
            </section>

            <section>
                <SectionLabel>重要キーワード</SectionLabel>
                {result.terms?.length > 0 ? (
                    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
                        {result.terms.map((term: Term, i: number) => (
                            <TermCard
                                key={`${term.english}-${i}`}
                                english={term.english}
                                japanese={term.japanese}
                                explanation={term.explanation}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted">専門用語を生成できませんでした。</p>
                )}
            </section>

            <p className="text-xs text-subtle">
                ※ AIによる自動生成のため、誤りを含む場合があります。正確な内容は原文で確認してください。
            </p>
        </div>
    );
}
