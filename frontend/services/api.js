const API_BASE = "/api";

export async function request(url, options = {}) {
  const res = await fetch(API_BASE + url, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  return res.json();
}