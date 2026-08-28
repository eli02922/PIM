export function createElasticsearchService({ baseUrl, index }) {
  if (!baseUrl) return null

  return {
    async search({ query, status }) {
      const must = query ? [{ multi_match: { query, fields: ['name^3', 'sku^2', 'category'] } }] : [{ match_all: {} }]
      if (status) must.push({ term: { status: status.toLowerCase() } })
      const response = await fetch(`${baseUrl}/${index}/_search`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: { bool: { must } }, size: 1000 }),
      })
      if (!response.ok) throw new Error(`Elasticsearch returned ${response.status}`)
      const payload = await response.json()
      return payload.hits.hits.map((hit) => hit._source)
    },
  }
}
