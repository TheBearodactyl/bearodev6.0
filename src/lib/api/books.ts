/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Book, type NewBook, type BookQuery, API_BASE } from "$lib/types";
import { form_headers, get_api_token } from "$lib/utils/api";

export async function fetch_books(): Promise<Book[]> {
    try {
        const response = await fetch(`${API_BASE}/read-watch`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${get_api_token()}`,
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }

        const books: Book[] = await response.json();
        return books.sort((a, b) => a.title.localeCompare(b.title));
    } catch (err: any) {
        console.error("Failed to fetch books:", err);
        throw new Error(`Failed to fetch books: ${err.message || err}`);
    }
}

export async function fetch_book_by_id(id: string | number): Promise<Book> {
    try {
        const response = await fetch(`${API_BASE}/read-watch/${id}`, {
            method: "GET",
            headers: form_headers()
        });

        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (err: any) {
        console.error(`Failed to fetch book ${id}:`, err);
        throw new Error(`Failed to fetch book: ${err.message || err}`);
    }
}

export async function create_book(bookData: NewBook): Promise<Book> {
    try {
        const response = await fetch(`${API_BASE}/read-watch`, {
            method: "POST",
            headers: form_headers(),
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (err: any) {
        console.error("Failed to create book:", err);
        throw new Error(`Failed to create book: ${err.message || err}`);
    }
}

export async function update_book(id: string | number, bookData: Book): Promise<Book> {
    try {
        const response = await fetch(`${API_BASE}/read-watch/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${get_api_token()}`,
            },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (err: any) {
        console.error(`Failed to update book ${id}:`, err);
        throw new Error(`Failed to update book: ${err.message || err}`);
    }
}

export async function delete_book(id: string | number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE}/read-watch/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${get_api_token()}`,
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
    } catch (err: any) {
        console.error(`Failed to delete book ${id}:`, err);
        throw new Error(`Failed to delete book: ${err.message || err}`);
    }
}

export async function search_books(query: BookQuery): Promise<Book[]> {
    try {
        const searchParams = new URLSearchParams();

        if (query.title) {
            searchParams.append("title", query.title);
        }
        if (query.author) {
            searchParams.append("author", query.author);
        }
        if (query.genres && query.genres.length > 0) {
            searchParams.append("genres", query.genres.join(","));
        }
        if (query.tags && query.tags.length > 0) {
            searchParams.append("tags", query.tags.join(","));
        }
        if (query.min_rating !== null && query.min_rating !== undefined) {
            searchParams.append("min_rating", query.min_rating.toString());
        }
        if (query.max_rating !== null && query.max_rating !== undefined) {
            searchParams.append("max_rating", query.max_rating.toString());
        }
        if (query.status) {
            searchParams.append("status", query.status);
        }
        if (query.explicit !== null && query.explicit !== undefined) {
            searchParams.append("explicit", query.explicit.toString());
        }
        if (query.sort) {
            searchParams.append("sort", query.sort);
        }

        const queryString = searchParams.toString();
        const url = queryString
            ? `${API_BASE}/read-watch/search?${queryString}`
            : `${API_BASE}/read-watch/search`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${get_api_token()}`,
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (err: any) {
        console.error("Failed to search books:", err);
        throw new Error(`Failed to search books: ${err.message || err}`);
    }
}
