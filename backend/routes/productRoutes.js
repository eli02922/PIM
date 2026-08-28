import { Router } from 'express'
import { httpError } from '../middleware/errorHandler.js'
import { validateProduct } from '../validators/productValidator.js'

export function createProductRouter(catalogService) {
  const router = Router()

  router.get('/stats', async (_request, response, next) => {
    try { response.json(await catalogService.getStats()) } catch (error) { next(error) }
  })

  router.get('/', async (request, response, next) => {
    try {
      const page = Math.max(Number(request.query.page) || 1, 1)
      const pageSize = Math.min(Math.max(Number(request.query.pageSize) || 20, 1), 100)
      response.json(await catalogService.listProducts({ query: request.query.search, status: request.query.status, page, pageSize }))
    } catch (error) { next(error) }
  })

  router.get('/:sku', async (request, response, next) => {
    try {
      const product = await catalogService.getProduct(request.params.sku)
      if (!product) throw httpError(404, 'Product not found')
      response.json(product)
    } catch (error) { next(error) }
  })

  router.post('/', async (request, response, next) => {
    try {
      const errors = validateProduct(request.body)
      if (Object.keys(errors).length) throw httpError(400, JSON.stringify(errors))
      if (await catalogService.getProduct(request.body.sku)) throw httpError(409, 'SKU already exists')
      response.status(201).json(await catalogService.createProduct(request.body))
    } catch (error) { next(error) }
  })

  router.patch('/:sku', async (request, response, next) => {
    try {
      const errors = validateProduct(request.body, { partial: true })
      if (Object.keys(errors).length) throw httpError(400, JSON.stringify(errors))
      const product = await catalogService.updateProduct(request.params.sku, request.body)
      if (!product) throw httpError(404, 'Product not found')
      response.json(product)
    } catch (error) { next(error) }
  })

  router.delete('/:sku', async (request, response, next) => {
    try {
      if (!await catalogService.deleteProduct(request.params.sku)) throw httpError(404, 'Product not found')
      response.status(204).send()
    } catch (error) { next(error) }
  })

  return router
}
