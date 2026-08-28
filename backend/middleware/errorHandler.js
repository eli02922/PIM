export function notFound(request, response) {
  response.status(404).json({ error: `Route not found: ${request.method} ${request.path}` })
}

export function errorHandler(error, _request, response, _next) {
  console.error(error)
  response.status(error.statusCode || 500).json({ error: error.statusCode ? error.message : 'Internal server error' })
}

export function httpError(statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}
