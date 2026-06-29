"use client";

import { useState } from "react";

export default function TermCard({
    english,
    japanese,
    explanation,
}: {
    english: string;
    japanese: string;
    explanation: string;
}) {
    const [open, setOpen] =
        useState(false);

    return (
        <li
            style={{
                marginBottom: "10px",
            }}
        >
            <button
                onClick={() =>
                    setOpen(!open)
                }
            >
                {open ? "▼" : "▶"}{" "}
                {english}({japanese})
            </button>

            {open && (
                <p>
                    {explanation}
                </p>
            )}
        </li>
    );
}