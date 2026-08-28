export function createSearchService({ repository, elasticsearch }) {
  return {
    async search({ query = '', status = '', page = 1, pageSize = 20 }) {
      const products = elasticsearch ? await elasticsearch.search({ query, status }) : await repository.list()
      const normalizedQuery = query.trim().toLowerCase()
      const filtered = products.filter((product) => {
        const matchesQuery = !normalizedQuery || `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(normalizedQuery)
        const matchesStatus = !status || product.status === status
        return matchesQuery && matchesStatus
      })
      const start = (page - 1) * pageSize
      return { items: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize }
    },
  }
}
