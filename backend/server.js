import { fileURLToPath } from 'node:url'
import app from './app.js'
import { env } from './config/env.js'

app.listen(env.port, () => console.log(`PIM API listening on http://localhost:${env.port}`))

export default app
