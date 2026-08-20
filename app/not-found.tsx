import Link from "next/link";

export default function NotFound() {
    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h2>ページが見つかりませんでした</h2>
            <p style={{ color: "#666", marginTop: "10px" }}>
                お探しのページは存在しないか、移動した可能性があります。
            </p>
            <Link
                href="/"
                style={{
                    display: "inline-block",
                    marginTop: "20px",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    backgroundColor: "#2563eb",
                    color: "white",
                    textDecoration: "none",
                }}
            >
                トップに戻る
            </Link>
        </div>
    );
}
