export type Author = {
    name: string[];
};

export type Category = {
    $: {
        term: string;
    };
};

export type Paper = {
    id: string[];
    title: string[];
    summary: string[];
    published: string[];
    author: Author[];
    category: Category[];
};

export type NormalizedPaper = {
    id: string;
    title: string;
    summary: string;
    published: string;
    authors: string[];
    categories: string[];
};

export type Bookmark = NormalizedPaper;
