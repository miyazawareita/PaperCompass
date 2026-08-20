"use client";

import { useSyncExternalStore } from "react";
import type { Bookmark } from "../types/Paper";

const STORAGE_KEY = "bookmarks";

function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot(): string {
    return "[]";
}

export function useBookmarks(): [
    Bookmark[],
    (updater: (prev: Bookmark[]) => Bookmark[]) => void,
] {
    const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const bookmarks: Bookmark[] = JSON.parse(raw);

    function setBookmarks(updater: (prev: Bookmark[]) => Bookmark[]) {
        const next = updater(bookmarks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("storage"));
    }

    return [bookmarks, setBookmarks];
}
