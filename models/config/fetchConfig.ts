export interface FetchConfig {
    body?: any | null;
    cache?: RequestCache;
    credentials?: RequestCredentials;
    headers?: HeadersInit;
    integrity?: string;
    keepalive?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    mode?: RequestMode;
    priority?: RequestPriority;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    signal?: AbortSignal | null;
    window?: null;
    retry?: number;
    baseURL?: string;
    params?: Record<string, any>;
    query?: Record<string, any>;
}