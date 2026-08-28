const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { 'content-type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) throw new Error((await response.json()).error || `Request failed with ${response.status}`)
  return response.status === 204 ? null : response.json()
}

export const productApi = {
  list: (params = {}) => request(`/products?${new URLSearchParams(params)}`),
  create: (product) => request('/products', { method: 'POST', body: JSON.stringify(product) }),
  publish: (skus) => request('/workflows/publish', { method: 'POST', body: JSON.stringify({ skus }) }),
}
