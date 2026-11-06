export default defineEventHandler(async (event) => {
  const body = await readBody<{ contentMd?: string }>(event)
  const source = String(body.contentMd ?? '')

  return renderMarkdown(source)
})
