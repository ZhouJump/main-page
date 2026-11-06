import pg from 'pg'

const url = new URL(process.env.DATABASE_URL)
url.searchParams.delete('sslmode')
const client = new pg.Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } })
await client.connect()
await client.query(`create schema if not exists "v3"`)
console.log('schema v3 ready')
await client.end()
