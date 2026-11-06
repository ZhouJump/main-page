import type { H3Event } from 'h3'
import { resolve } from 'node:path'

const CONTENT_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.avif': 'image/avif'
}

export function uploadRoot(event: H3Event): string {
  const dir = useRuntimeConfig(event).uploadDir || './data/uploads'
  return resolve(process.cwd(), dir)
}

export function contentTypeFor(path: string): string {
  const ext = path.slice(path.lastIndexOf('.')).toLowerCase()
  return CONTENT_TYPES[ext] ?? 'application/octet-stream'
}
