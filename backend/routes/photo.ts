import { createRoute } from '@hono/zod-openapi'
import { $200, $400, multipartFormContent } from './utils'
import { z } from 'zod'

const photoSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  title: z.string().max(64),
})
const photosSchema = z.array(photoSchema)
export type Photo = z.infer<typeof photoSchema>

export const photoGetRoute = createRoute({
  method: 'get',
  path: 'api/photos',
  responses: {
    ...$200(photosSchema, 'Returns all photos'),
  },
})

export const photoPostRoute = createRoute({
  method: 'post',
  path: 'api/photos',
  request: {
    body: multipartFormContent(
      z.object({
        title: z.string().max(64),
        image: z.instanceof(File).refine(
          (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
          'File type must be JPEG, PNG or WebP'
        )
      })
    ),
  },
  responses: {
    ...$200(photoSchema, 'Returns the created photo'),
    ...$400('Invalid file format')
  },
})
