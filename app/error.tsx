"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className="mx-auto max-w-md px-4 py-24 text-center">
            <h1 className="text-2xl font-bold">エラーが発生しました</h1>
            <p className="mt-3 text-muted">
                {error.message || "予期しないエラーが発生しました。"}
            </p>
            <button
                type="button"
                onClick={reset}
                className="mt-8 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
            >
                再読み込み
            </button>
        </main>
    );
}
