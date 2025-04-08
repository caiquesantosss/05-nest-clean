import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { config } from 'dotenv'
import { execSync } from 'node:child_process'

config({ path: '.env', override: true})
config({ path: '.env.test', override: true})

const prisma = new PrismaClient()

function generateUniqueDatabaseUrl(UrlSchema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', UrlSchema)

  return url.toString()
}

beforeAll(async () => {
    const database = generateUniqueDatabaseUrl(randomUUID())

    process.env.DATABASE_URL = database

    execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${randomUUID()}" CASCADE`)
})
