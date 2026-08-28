export const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  elasticsearchUrl: process.env.ELASTICSEARCH_URL || '',
  elasticsearchIndex: process.env.ELASTICSEARCH_INDEX || 'products',
}
