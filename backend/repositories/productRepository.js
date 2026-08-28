export function createProductRepository(store) {
  return {
    async list() {
      return store.read()
    },

    async findBySku(sku) {
      const products = await store.read()
      return products.find((product) => product.sku === sku) || null
    },

    async create(product) {
      const products = await store.read()
      products.unshift(product)
      await store.write(products)
      return product
    },

    async update(sku, changes) {
      const products = await store.read()
      const index = products.findIndex((product) => product.sku === sku)
      if (index === -1) return null
      products[index] = { ...products[index], ...changes, sku }
      await store.write(products)
      return products[index]
    },

    async remove(sku) {
      const products = await store.read()
      const remaining = products.filter((product) => product.sku !== sku)
      if (remaining.length === products.length) return false
      await store.write(remaining)
      return true
    },
  }
}
