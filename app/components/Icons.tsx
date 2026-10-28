type IconProps = {
    className?: string;
};

const base = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

export function CompassIcon({ className }: IconProps) {
    return (
        <svg {...base} className={className}>
            <circle cx="12" cy="12" r="9.5" />
            <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function BookmarkIcon({
    className,
    filled = false,
}: IconProps & { filled?: boolean }) {
    return (
        <svg {...base} className={className} fill={filled ? "currentColor" : "none"}>
            <path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4-6.5 4v-16a1 1 0 0 1 1-1Z" />
        </svg>
    );
}

export function ShuffleIcon({ className }: IconProps) {
    return (
        <svg {...base} className={className}>
            <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
        </svg>
    );
}

export function SparkleIcon({ className }: IconProps) {
    return (
        <svg {...base} className={className}>
            <path d="M12 3.5 13.8 9a2 2 0 0 0 1.2 1.2l5.5 1.8-5.5 1.8a2 2 0 0 0-1.2 1.2L12 20.5 10.2 15A2 2 0 0 0 9 13.8L3.5 12 9 10.2A2 2 0 0 0 10.2 9L12 3.5Z" />
        </svg>
    );
}

export function ExternalIcon({ className }: IconProps) {
    return (
        <svg {...base} className={className}>
            <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
    );
}

export function FileIcon({ className }: IconProps) {
    return (
        <svg {...base} className={className}>
            <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z" />
            <path d="M14 3v4h4M9 13h6M9 17h4" />
        </svg>
    );
}

export function ChevronIcon({ className }: IconProps) {
    return (
        <svg {...base} className={className}>
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

export function CloseIcon({ className }: IconProps) {
    return (
        <svg {...base} className={className}>
            <path d="M6 6l12 12M18 6 6 18" />
        </svg>
    );
}
