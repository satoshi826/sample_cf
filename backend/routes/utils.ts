import { z } from '@hono/zod-openapi'

export const jsonContent = <T>(schema: T) => ({
  content: { 'application/json': { schema } },
})

export const $200 = <T>(schema: T, desc = '') => ({
  200: {
    ...jsonContent(schema),
    description: desc,
  },
})

export const $400 = (desc = 'Bad Request') => ({
  400: {
    ...jsonContent(
      z.object({
        code: z.literal(400).openapi({ example: 400 }),
        message: z.string().openapi({ example: desc }),
      }),
    ),
    description: desc,
  },
})

export const $404 = (desc = 'Not Found') => ({
  404: {
    ...jsonContent(
      z.object({
        code: z.literal(404).openapi({ example: 404 }),
        message: z.string().openapi({ example: desc }),
      }),
    ),
    description: desc,
  },
})

export const multipartFormContent = <T>(schema: T) => ({
  content: { 'multipart/form-data': { schema } },
})
