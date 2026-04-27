const API_BASE = "/api";

export async function request(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Erro na requisição");
    }

    return res.json();
  } catch (err) {
    console.error("API ERROR:", err.message);
    throw err;
  }
}