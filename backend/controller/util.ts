/// <reference path="../../worker-configuration.d.ts" />
import { drizzle } from 'drizzle-orm/d1'
import { env } from 'cloudflare:workers'

export const getDB = () => {
  const db = drizzle(env.DB)
  return db
}
