import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { photoGetAllController, photoPostController } from './controller/photo'
import { photoGetRoute, photoPostRoute } from './routes/photo'
import { handleError, hono } from './utils'
import { env } from 'cloudflare:workers'

const app = hono()
app.use(logger()).use(cors()).onError(handleError)

app.get('/ui', swaggerUI({ url: '/doc' }))
app.doc('/doc', { info: { title: 'An API', version: 'v1' }, openapi: '3.1.0' })

const route = app
  .openapi(photoGetRoute, photoGetAllController)
  .openapi(photoPostRoute, photoPostController)
  .get('photos/:key', async (c) => {
    const key = c.req.param('key')
    const object = await env.storage.get(key!)
    if (!object) return c.notFound()
    const body = await object.arrayBuffer()
    return c.body(body, 200, {'Content-Type': object.httpMetadata?.contentType ?? 'image/jpeg'})
  })


export type HONO_API = typeof route

export default app
