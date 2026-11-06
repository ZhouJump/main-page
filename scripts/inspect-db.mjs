import pg from 'pg'

const url = new URL(process.env.DATABASE_URL)
url.searchParams.delete('sslmode')
const client = new pg.Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } })
await client.connect()

const q = async (sql, params = []) => (await client.query(sql, params)).rows

for (const table of ['posts', 'post_translations', 'categories', 'tags', 'post_tags', 'post_categories', 'comments', 'uploads']) {
  const cols = await q(
    `select column_name, data_type from information_schema.columns where table_schema = 'main_page' and table_name = $1 order by ordinal_position`,
    [table]
  )
  const count = await q(`select count(*)::int as n from main_page.${table}`)
  console.log(`== ${table} rows=${count[0].n}`)
  console.log(cols.map((c) => `${c.column_name}:${c.data_type}`).join(' | '))
}

console.log('schemas', await q(`select nspname, pg_get_userbyid(nspowner) as owner from pg_namespace where nspname in ('public','main_page','main-page')`))
console.log('db create', await q(`select has_database_privilege(current_user, current_database(), 'CREATE') as can_create_db`))

await client.end()
