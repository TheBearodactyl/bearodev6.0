export const API_BASE = "https://api.bearodactyl.dev";

export interface Book {
    _id: { $oid: string };
    title: string;
    author: string;
    genres: string[];
    tags: string[];
    rating: number;
    status: string;
    description: string;
    my_thoughts: string;
    links?: Map<string, string>;
    cover_image: string;
    explicit: boolean;
    color?: string;
}

export interface BookQuery {
    title?: string;
    author?: string;
    genres?: string[];
    tags?: string[];
    rating?: number;
    status?: string;
    description?: string;
    my_thoughts?: string;
    links?: Map<string, string>;
    cover_image?: string;
    explicit?: boolean;
    color?: string;
}
