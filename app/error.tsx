"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h2>エラーが発生しました</h2>
            <p style={{ color: "#666", marginTop: "10px" }}>
                {error.message || "予期しないエラーが発生しました。"}
            </p>
            <button
                onClick={reset}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                    backgroundColor: "#2563eb",
                    color: "white",
                }}
            >
                再読み込み
            </button>
        </div>
    );
}
