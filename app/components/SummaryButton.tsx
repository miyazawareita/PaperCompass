"use client";

import { useState } from "react";

export default function SummaryButton({
    abstract,
}: {
    abstract: string;
}) {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    async function handleClick() {
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
                marginTop: "5px",
            }}>
                3行要約+専門用語解説を生成
            </p>

            {result && (
                <>
                    <h2>今日のAI要約</h2>

                    <p style={{ whiteSpace: "pre-wrap" }}>
                        {result.summary}
                    </p>

                    <h2>📚 専門用語</h2>

                    {result.terms.length > 0 ? (
                        <ul>
                            {result.terms.map((term: any) => (
                                <li key={term.word}>
                                    <strong>{term.word}</strong>
                                    <br />
                                    {term.explanation}
                                </li>
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