import Link from "next/link";

export default function NotFound() {
    return (
        <main className="mx-auto max-w-md px-4 py-24 text-center">
            <p className="font-mono text-sm text-accent">404</p>
            <h1 className="mt-2 text-2xl font-bold">ページが見つかりませんでした</h1>
            <p className="mt-3 text-muted">
                お探しのページは存在しないか、移動した可能性があります。
            </p>
            <Link
                href="/"
                className="mt-8 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
            >
                トップに戻る
            </Link>
        </main>
    );
}
