import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { join, normalize, sep } from 'node:path'

export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'path') ?? ''
  let decoded: string

  try {
    decoded = decodeURIComponent(raw)
  } catch {
    throw createError({ statusCode: 400, statusMessage: '路径无效' })
  }

  if (!decoded || decoded.includes('\0')) {
    throw createError({ statusCode: 400, statusMessage: '路径无效' })
  }

  const cleaned = normalize(decoded).replace(/^[/\\]+/, '')

  if (!cleaned || cleaned.split(/[/\\]/).some((segment) => segment === '..')) {
    throw createError({ statusCode: 403, statusMessage: '禁止访问' })
  }

  const root = uploadRoot(event)
  const target = join(root, cleaned)

  if (!target.startsWith(root + sep)) {
    throw createError({ statusCode: 403, statusMessage: '禁止访问' })
  }

  const info = await stat(target).catch(() => null)

  if (!info?.isFile()) {
    throw createError({ statusCode: 404, statusMessage: '文件不存在' })
  }

  setResponseHeader(event, 'Content-Type', contentTypeFor(target))
  setResponseHeader(event, 'Content-Length', info.size)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return sendStream(event, createReadStream(target))
})
