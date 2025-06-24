import type { RouteHandler } from '@hono/zod-openapi'
import type { photoGetRoute, photoPostRoute } from '../routes/photo'
import { getDB } from './util'
import { photos } from '../db/schema'
import { env } from 'cloudflare:workers'

export const photoGetAllController: RouteHandler<typeof photoGetRoute> = async (c) => {
  const db = getDB()
  const p = await db.select().from(photos)
  return c.json(p, 200)
}

export const photoPostController: RouteHandler<typeof photoPostRoute> = async (c) => {
  const {title, image} = c.req.valid('form')
  const fileExt = image.name.split('.').pop() || 'jpg'
  const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  await env.storage.put(uniqueFileName, await image.arrayBuffer(), {httpMetadata: {contentType: image.type }})
  const url = `${env.ORIGIN}/photos/${uniqueFileName}`
  const db = getDB()
  const [photo] = await db.insert(photos)
    .values({ title, url })
    .returning()
    return c.json(photo, 200)
}
