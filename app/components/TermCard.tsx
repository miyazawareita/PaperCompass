"use client";

import { useState } from "react";
import { ChevronIcon } from "./Icons";

export default function TermCard({
    english,
    japanese,
    explanation,
}: {
    english: string;
    japanese: string;
    explanation: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <li>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted"
            >
                <span>
                    <span className="font-medium">{japanese}</span>
                    <span className="ml-2 text-sm text-subtle">{english}</span>
                </span>
                <ChevronIcon
                    className={`size-4 shrink-0 text-subtle transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <p className="px-4 pb-4 text-sm leading-relaxed text-muted">
                    {explanation}
                </p>
            )}
        </li>
    );
}
