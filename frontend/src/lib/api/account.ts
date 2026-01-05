export type Me = {
    id: number | string;
    email: string;
    name: string;
    role?: string;
    picture?: string | null;
};

export type MySuggestion = {
    id: number | string;
    title: string;
    status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | "COMPLETED";
    suggestionType?: "SIGNAL" | "CROSSWALK" | "FACILITY";
    createdAt?: string;
    likeCount?: number;
    viewCount?: number;
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
        credentials: "include",
        cache: "no-store",
    });

    // 서버가 {success,message,data} 형식이면 여기에 맞춰도 됨.
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status}`);
    }
    return (await res.json()) as T;
}

export function fetchMe() {
    return request<Me>("/api/me");
}

export function updateProfile(input: { name: string }) {
    return request<{ ok: true }>("/api/me", {
        method: "PATCH",
        body: JSON.stringify(input),
    });
}

export function changePassword(input: { currentPassword: string; newPassword: string }) {
    return request<{ ok: true }>("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export function fetchMySuggestions(params: {
    page: number;
    pageSize: number;
    status: "ALL" | MySuggestion["status"];
}) {
    const sp = new URLSearchParams();
    sp.set("page", String(params.page));
    sp.set("pageSize", String(params.pageSize));
    sp.set("status", params.status);
    return request<{
        items: MySuggestion[];
        page: number;
        pageSize: number;
        total: number;
    }>(`/api/suggestions/my?${sp.toString()}`);
}
