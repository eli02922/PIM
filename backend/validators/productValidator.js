const allowedStatuses = ['Published', 'In review', 'Draft', 'Needs attention']

export function validateProduct(input, { partial = false } = {}) {
  const errors = {}
  const requiredFields = ['name', 'sku', 'category', 'status', 'channels']

  if (!partial) {
    for (const field of requiredFields) {
      if (input[field] === undefined || input[field] === '') errors[field] = 'This field is required'
    }
  }
  if (input.name !== undefined && typeof input.name !== 'string') errors.name = 'Name must be a string'
  if (input.sku !== undefined && (typeof input.sku !== 'string' || !/^[A-Z0-9-]+$/.test(input.sku))) errors.sku = 'SKU must contain only uppercase letters, numbers, and hyphens'
  if (input.category !== undefined && typeof input.category !== 'string') errors.category = 'Category must be a string'
  if (input.status !== undefined && !allowedStatuses.includes(input.status)) errors.status = `Status must be one of: ${allowedStatuses.join(', ')}`
  if (input.channels !== undefined && (!Array.isArray(input.channels) || input.channels.some((channel) => typeof channel !== 'string'))) errors.channels = 'Channels must be an array of strings'

  return errors
}

export { allowedStatuses }
