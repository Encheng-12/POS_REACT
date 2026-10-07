const API_BASE = import.meta.env.VITE_API_URL
const LOGIN = `${API_BASE}/login`
const USERS_URL = `${API_BASE}/users`

export async function login({ email, password }) {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Login failed')
  return data
}