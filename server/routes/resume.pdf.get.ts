import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { resolve } from 'node:path'

const RESUME_FILE = '周楚杰-前端开发工程师.pdf'

export default defineEventHandler(async (event) => {
  const target = resolve(process.cwd(), 'doc', RESUME_FILE)
  const info = await stat(target).catch(() => null)

  if (!info?.isFile()) {
    throw createError({ statusCode: 404, statusMessage: '简历文件不存在' })
  }

  setResponseHeader(event, 'Content-Type', 'application/pdf')
  setResponseHeader(event, 'Content-Length', info.size)
  setResponseHeader(event, 'Content-Disposition', 'inline; filename="zhoujump-resume.pdf"')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')

  return sendStream(event, createReadStream(target))
})
