"use client";

import { useState } from "react";

export default function AbstractSection({
    abstract,
}: {
    abstract: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ marginTop: "20px" }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                {open
                    ? "▼ Abstractを隠す"
                    : "▶ Abstractを表示"}
            </button>

            {open && (
                <p
                    style={{
                        whiteSpace: "pre-wrap",
                        marginTop: "15px",
                    }}
                >
                    {abstract}
                </p>
            )}
        </div>
    );
}