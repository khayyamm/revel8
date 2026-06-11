const API = "http://localhost:8080/api/bank";

export async function api(method, path, body) {
    const res = await fetch(`${API}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
        throw new Error(data?.message || `HTTP ${res.status}`);
    }

    return data;
}