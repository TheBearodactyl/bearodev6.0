import type { BookQuery } from "$lib/types";

export function build_rw_search_params(query: BookQuery): string {
    const query_str = new URLSearchParams();

    if (query.tags !== undefined) {
        for (const tag of query.tags) {
            query_str.append("tag", `+${tag}`);
        }
    }

    if (query.genres !== undefined) {
        for (const genre of query.genres) {
            query_str.append("genre", `+${genre}`);
        }
    }

    return query_str.toString();
}
