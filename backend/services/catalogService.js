export function createCatalogService({ repository, searchService }) {
  return {
    listProducts: (filters) => searchService.search(filters),
    getProduct: (sku) => repository.findBySku(sku),
    createProduct: (product) => repository.create({ ...product, updated: new Date().toISOString() }),
    updateProduct: (sku, changes) => repository.update(sku, { ...changes, updated: new Date().toISOString() }),
    deleteProduct: (sku) => repository.remove(sku),

    async publishProducts(skus) {
      const published = []
      for (const sku of skus) {
        const product = await repository.update(sku, { status: 'Published', updated: new Date().toISOString() })
        if (product) published.push(product)
      }
      return published
    },

    async getStats() {
      const products = await repository.list()
      const published = products.filter((product) => product.status === 'Published').length
      const needsAttention = products.filter((product) => product.status === 'Needs attention').length
      const channelCount = new Set(products.flatMap((product) => product.channels)).size
      return { total: products.length, published, needsAttention, channelCount }
    },
  }
}
