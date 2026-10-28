"use client";

import { BookmarkIcon, CloseIcon } from "./Icons";
import type { Bookmark } from "../types/Paper";

export default function BookmarkList({
    bookmarks,
    selectedId,
    onSelect,
    onDelete,
}: {
    bookmarks: Bookmark[];
    selectedId: string | null;
    onSelect: (bookmark: Bookmark) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <section aria-labelledby="bookmarks-heading" className="mt-10">
            <h2
                id="bookmarks-heading"
                className="mb-3 flex items-center gap-2 text-lg font-semibold"
            >
                <BookmarkIcon className="size-5 text-accent" />
                保存した論文
                {bookmarks.length > 0 && (
                    <span className="rounded-full bg-surface-muted px-2 text-sm font-normal text-muted">
                        {bookmarks.length}
                    </span>
                )}
            </h2>

            {bookmarks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line-strong px-4 py-6 text-center text-sm text-muted">
                    気になる論文を「保存する」と、ここからいつでも見返せます。
                </p>
            ) : (
                <ul className="space-y-2">
                    {bookmarks.map((bookmark) => (
                        <li
                            key={bookmark.id}
                            className={`flex items-center gap-2 rounded-lg border pr-2 transition-colors ${
                                selectedId === bookmark.id
                                    ? "border-accent bg-accent-soft"
                                    : "border-line bg-surface hover:border-line-strong"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => onSelect(bookmark)}
                                className="min-w-0 flex-1 px-3 py-2.5 text-left"
                            >
                                <span className="line-clamp-1 text-sm font-medium">
                                    {bookmark.title}
                                </span>
                                <span className="text-xs text-subtle">
                                    {bookmark.published.split("T")[0]}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(bookmark.id)}
                                aria-label="保存を解除"
                                title="保存を解除"
                                className="grid size-8 shrink-0 place-items-center rounded-md text-subtle transition-colors hover:bg-surface-muted hover:text-danger"
                            >
                                <CloseIcon className="size-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
