import 'dotenv/config'
import { defineConfig, type Config } from 'drizzle-kit'
import * as fs from 'node:fs'
import * as path from 'node:path'

const { CLOUDFLARE_DATABASE_ID, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_TOKEN, USE_REMOTE } = process.env

function findLatestWranglerSQLiteFile(): string | undefined {
  const wranglerDir = path.resolve('.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject')
  if (!fs.existsSync(wranglerDir)) {
    console.warn(`Warning: Wrangler SQLite directory not found: ${wranglerDir}`)
    return undefined
  }

  try {
    const sqliteFiles = fs
      .readdirSync(wranglerDir)
      .filter((file) => file.endsWith('.sqlite'))
      .map((file) => ({
        name: file,
        path: path.join(wranglerDir, file),
        mtime: fs.statSync(path.join(wranglerDir, file)).mtime,
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
    if (sqliteFiles.length === 0) {
      console.warn('No SQLite files found in Wrangler directory')
      return undefined
    }
    console.log(`Using latest Wrangler SQLite file: ${sqliteFiles[0].name}`)
    return sqliteFiles[0].path
  } catch (error) {
    console.error('Error finding Wrangler SQLite files:', error)
    return undefined
  }
}

const localConfig = {
  out: './backend/db/migrations',
  schema: './backend/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: findLatestWranglerSQLiteFile()!,
  },
} satisfies Config

const remoteConfig = {
  out: './backend/db/migrations',
  schema: './backend/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: CLOUDFLARE_ACCOUNT_ID!,
    databaseId: CLOUDFLARE_DATABASE_ID!,
    token: CLOUDFLARE_D1_TOKEN!,
  },
} satisfies Config

export default defineConfig(USE_REMOTE === 'true' ? remoteConfig : localConfig)
