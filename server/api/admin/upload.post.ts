import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const MAX_BYTES = 8 * 1024 * 1024

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  const filePart = parts?.find((part) => part.filename || part.name === 'file')

  if (!filePart || !filePart.data.length) {
    throw createError({ statusCode: 400, statusMessage: '请选择要上传的图片' })
  }

  const mime = (filePart.type ?? '').toLowerCase()

  if (!ALLOWED_MIME.has(mime)) {
    throw createError({ statusCode: 415, statusMessage: '仅支持 JPG / PNG / WebP / GIF / AVIF' })
  }

  if (filePart.data.length > MAX_BYTES) {
    throw createError({ statusCode: 413, statusMessage: '图片不能超过 8MB' })
  }

  const isGif = mime === 'image/gif'
  const source = filePart.data
  let output = source
  let outputMime = mime
  let width: number | undefined
  let height: number | undefined

  try {
    if (isGif) {
      const meta = await sharp(source).metadata()
      width = meta.width
      height = meta.height
    } else {
      const result = await sharp(source)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true })

      output = result.data
      outputMime = 'image/webp'
      width = result.info.width
      height = result.info.height
    }
  } catch {
    throw createError({ statusCode: 400, statusMessage: '无法解析该图片文件' })
  }

  const now = new Date()
  const folder = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`
  const ext = isGif ? 'gif' : 'webp'
  const filename = `${randomUUID()}.${ext}`
  const relativePath = `${folder}/${filename}`
  const root = uploadRoot(event)
  const target = join(root, folder, filename)

  await mkdir(join(root, folder), { recursive: true })
  await writeFile(target, output)

  await prisma.media.create({
    data: {
      path: `/uploads/${relativePath}`,
      mime: outputMime,
      size: output.length,
      width,
      height
    }
  })

  return {
    path: `/uploads/${relativePath}`,
    mime: outputMime,
    size: output.length,
    width,
    height
  }
})
