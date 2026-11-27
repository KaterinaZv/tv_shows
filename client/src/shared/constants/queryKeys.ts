// Root query keys: favorites change both the favorites list and the star state in search results
export const SHOWS_QUERY_KEY = ['shows'] as const;

export const FAVORITES_QUERY_KEY = ['favorites'] as const;

// Who is logged in: login and logout change it, and with it everything personal (favorites, stars)
export const CURRENT_USER_QUERY_KEY = ['currentUser'] as const;
