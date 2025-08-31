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
  links: Record<string, string>;
  cover_image: string;
  explicit: boolean;
  color?: string;
}

export interface NewBook {
  title: string;
  author: string;
  genres: string[];
  tags: string[];
  rating: number;
  status: string;
  description: string;
  my_thoughts: string;
  links: Record<string, string>;
  cover_image: string;
  explicit: boolean;
  color?: string;
}

export interface BookQuery {
  title?: string;
  author?: string;
  genres?: string[];
  tags?: string[];
  min_rating?: number;
  max_rating?: number;
  status?: string;
  explicit?: boolean;
  sort?: string;
}

export interface Game {
  _id: { $oid: string };
  title: string;
  developer: string;
  genres: string[];
  tags: string[];
  rating: number;
  status: string;
  description: string;
  my_thoughts: string;
  links: Record<string, string>;
  cover_image: string;
  explicit: boolean;
  percent: number;
  bad: boolean;
  color?: string;
}

export interface GameQuery {
  title?: string;
  developer?: string;
  genres?: string[];
  tags?: string[];
  min_rating?: number;
  max_rating?: number;
  exact_rating?: number;
  min_progress?: number;
  max_progress?: number;
  exact_progress?: number;
  status?: string;
  explicit?: boolean;
  sort?: string;
  bad?: boolean;
}

export interface CardInfo {
  title: string;
  description: string;
}

export interface HomePageItem {
  image: string;
  img_alt: string;
  info?: CardInfo;
}

export interface RouteItemNext {
  path: string;
  name_key?: string;
  key: string;
  children?: RouteItemNext[];
  home_page?: boolean;
  cover_image?: string;
  video_src?: string;
  audio_src?: string;
  discouraged?: boolean;
  title?: string;
  description?: string;
  name?: string;
}
