"use client";

import { useState } from "react";
import TermCard from "./TermCard";
import type { Term, SummaryResult } from "../types/SummaryResult";

export default function SummaryButton({
    abstract,
    paperId,
}: {
    abstract: string;
    paperId: string;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SummaryResult | null>(null);

    async function handleClick() {
        const cache = localStorage.getItem(`summary-${paperId}`);
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
                body: JSON.stringify({ abstract }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
            localStorage.setItem(`summary-${paperId}`, JSON.stringify(data));
        } catch {
            setError("AI要約の生成に失敗しました。もう一度お試しください。");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <button
                onClick={handleClick}
                disabled={loading}
                style={{
                    padding: "12px 20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: loading ? "not-allowed" : "pointer",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: loading ? "#9ca3af" : "#2563eb",
                    color: "white",
                    marginTop: "20px",
                    marginBottom: "20px",
                }}
            >
                {loading ? "⏳ 生成中..." : "🤖 AI解説を生成"}
            </button>

            <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                日本語要約+専門用語解説を生成
            </p>

            {error && (
                <p style={{ color: "#dc2626", marginTop: "10px" }}>{error}</p>
            )}

            {result?.hook && (
                <div
                    style={{
                        background: "#fff7ed",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                    }}
                >
                    <strong>💡 なぜ読む？</strong>
                    <p>{result.hook}</p>
                </div>
            )}

            {result && (
                <>
                    <p style={{ fontWeight: "bold", marginTop: "10px", marginBottom: "10px" }}>
                        🎓 難易度: {result.difficulty}
                        <br />
                        {result.difficulty_reason}
                    </p>

                    <h2 style={{ marginTop: "10px", marginBottom: "5px" }}>
                        🤖 AI要約
                    </h2>
                    <p style={{ whiteSpace: "pre-wrap" }}>{result.summary}</p>

                    <h2 style={{ marginTop: "10px", marginBottom: "5px" }}>
                        📚 重要キーワード
                    </h2>

                    {result.terms?.length > 0 ? (
                        <ul>
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
                        <p>専門用語を生成できませんでした。</p>
                    )}
                </>
            )}
        </div>
    );
}
