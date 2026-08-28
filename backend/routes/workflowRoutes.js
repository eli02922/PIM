import { Router } from 'express'
import { httpError } from '../middleware/errorHandler.js'

export function createWorkflowRouter(catalogService) {
  const router = Router()

  router.post('/publish', async (request, response, next) => {
    try {
      const { skus } = request.body
      if (!Array.isArray(skus) || skus.length === 0) throw httpError(400, 'skus must be a non-empty array')
      response.json({ published: await catalogService.publishProducts(skus) })
    } catch (error) { next(error) }
  })

  return router
}
