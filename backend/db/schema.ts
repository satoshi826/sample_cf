import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const photos = sqliteTable('photos', {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  url: text().notNull(),
  title: text().notNull(),
})

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  name: text().notNull(),
})
