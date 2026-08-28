import express from 'express'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from './config/env.js'
import { createJsonStore } from './db/jsonStore.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { createProductRepository } from './repositories/productRepository.js'
import { healthRouter } from './routes/healthRoutes.js'
import { createProductRouter } from './routes/productRoutes.js'
import { createWorkflowRouter } from './routes/workflowRoutes.js'
import { createCatalogService } from './services/catalogService.js'
import { createElasticsearchService } from './services/elasticsearchService.js'
import { createSearchService } from './services/searchService.js'

const currentDirectory = resolve(fileURLToPath(import.meta.url), '..')
const store = createJsonStore(resolve(currentDirectory, 'data/products.json'))
const repository = createProductRepository(store)
const elasticsearch = createElasticsearchService({ baseUrl: env.elasticsearchUrl, index: env.elasticsearchIndex })
const searchService = createSearchService({ repository, elasticsearch })
const catalogService = createCatalogService({ repository, searchService })

const app = express()
app.disable('x-powered-by')
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173')
  response.header('Access-Control-Allow-Headers', 'Content-Type')
  response.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  if (request.method === 'OPTIONS') return response.sendStatus(204)
  next()
})
app.use(express.json({ limit: '1mb' }))
app.use('/api/health', healthRouter)
app.use('/api/products', createProductRouter(catalogService))
app.use('/api/workflows', createWorkflowRouter(catalogService))
app.use(notFound)
app.use(errorHandler)

export default app

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(env.port, () => console.log(`PIM API listening on http://localhost:${env.port}`))
}
