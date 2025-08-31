import { browser } from "$app/environment";
import { getLocale } from "$lib/paraglide/runtime";
import type { BookQuery } from "$lib/types";

export function build_rw_search_params(query: BookQuery): string {
  const query_str = new URLSearchParams();

  query_str.append("locale", getLocale());

  if (query.title !== undefined) {
    query_str.append("title", query.title);
  }

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

export function form_headers() {
  let api_key = "";

  if (browser) {
    api_key = localStorage.getItem("api-key") || "";
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${api_key}`,
  };
}

export function get_api_token(): string {
  if (browser) {
    return localStorage.getItem("api-key") || "";
  } else {
    return "";
  }
}
