export type Term = {
    english: string;
    japanese: string;
    explanation: string;
};

export type SummaryResult = {
    summary: string;
    hook: string;
    difficulty: string;
    highlight: string;
    highlightType: string;
    terms: Term[];
};