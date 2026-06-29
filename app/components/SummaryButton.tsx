"use client";

import { useState, useEffect } from "react";
import TermCard from "./TermCard";

export default function SummaryButton({
    abstract,
    paperId,
}: {
    abstract: string;
    paperId: string;
}) {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setResult(null);
    }, [abstract]);

    async function handleClick() {

        const cache = localStorage.getItem(
            `summary-${paperId}`
        );

        if (cache) {
            setResult(JSON.parse(cache));
            return;
        }

        setLoading(true);

        const response = await fetch("/api/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                abstract,
            }),
        });

        const data = await response.json();

        setResult(data);

        localStorage.setItem(
            `summary-${paperId}`,
            JSON.stringify(data)
        );
        setLoading(false);
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

            <p style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "5px",
            }}>
                日本語要約+専門用語解説を生成
            </p>

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
                    <h2>AI日本語要約</h2>

                    <p style={{ whiteSpace: "pre-wrap" }}>
                        {result.summary}
                    </p>

                    <p
                        style={{
                            fontWeight: "bold",
                            marginTop: "10px",
                        }}
                    >
                        🎓 難易度: {result.difficulty}
                    </p>

                    {result.highlight && (
                        <>
                            <h2>
                                👀 この論文の見どころ
                                {result.highlightType && 
                                    `(${result.highlightType})`}
                            </h2>

                            <p style={{ whiteSpace: "pre-wrap" }}>
                                {result.highlight}
                            </p>
                        </>
                    )}

                    <h2>📚 専門用語</h2>

                    {result?.terms?.length > 0 ? (
                        <ul>
                            {result.terms.map((term: any, index: number) => (
                                <TermCard
                                    key={`${term.english}-${index}`}
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