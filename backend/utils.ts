import { OpenAPIHono } from '@hono/zod-openapi'
import type { Context } from 'hono'

export const hono = () =>
  new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        console.error(result.error.issues)
        return c.json(
          {
            code: 400,
            message: 'Error',
            issues: result.error.issues,
          },
          400,
        )
      }
    },
  })

export const handleError = (err: Error, c: Context): Response => {
  console.error(err)
  return c.json({ code: 500, message: 'Internal Server Error' }, 500)
}
