const BASE_URL = "http://localhost:8080/api";

async function apiRequest(url, options = {}) {
    const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(data.data || "API Error");
    }

    return data.data;
}

export default apiRequest;
