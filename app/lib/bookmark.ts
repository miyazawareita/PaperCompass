import type { Bookmark } from "../types/Paper";

export function loadBookmarks(): Bookmark[] {
    const saved = localStorage.getItem("bookmarks");

    if (saved) {
        return JSON.parse(saved) as Bookmark[];
    }
    return [];
}

export function saveBookmarks(
    bookmarks: Bookmark[]
): void {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
