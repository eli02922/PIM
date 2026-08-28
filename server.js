import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'pim-api' }))
app.listen(port, () => console.log(`PIM API listening on http://localhost:${port}`))
