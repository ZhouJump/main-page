import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'

const buckets = new Map<string, number[]>()

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (buckets.get(key) ?? []).filter((time) => now - time < windowMs)

  if (recent.length >= limit) {
    buckets.set(key, recent)
    return true
  }

  recent.push(now)
  buckets.set(key, recent)

  return false
}

export function resetRateLimit(key?: string): void {
  if (key) {
    buckets.delete(key)
  } else {
    buckets.clear()
  }
}

export function getClientIp(event: H3Event): string {
  return getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
}

export function hashValue(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export function md5(value: string): string {
  return createHash('md5').update(value).digest('hex')
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function gravatarUrl(emailHash: string | null, size = 96): string | null {
  if (!emailHash) {
    return null
  }

  return `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=mp`
}

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export function renderCommentHtml(content: string): string {
  const escaped = escapeHtml(content)
  const linked = escaped.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
    const safe = url.replace(/[.,;!?)]+$/g, '')
    const tail = url.slice(safe.length)
    return `<a href="${safe}" target="_blank" rel="noopener noreferrer nofollow">${safe}</a>${tail}`
  })

  return linked.replace(/\n/g, '<br>')
}

export type CommentValidationCode = 'nickname' | 'email' | 'content' | 'honeypot' | 'timing' | 'turnstile'

export interface CommentInput {
  nickname: string
  email?: string
  content: string
  honeypot?: string
  startedAt?: string
  token?: string
}

export function validateComment(input: CommentInput, now = Date.now()): CommentValidationCode[] {
  const errors: CommentValidationCode[] = []
  const nickname = input.nickname.trim()
  const content = input.content.trim()
  const email = (input.email ?? '').trim()

  if (nickname.length < 1 || nickname.length > 30) {
    errors.push('nickname')
  }

  if (email && (email.length > 120 || !isValidEmail(email))) {
    errors.push('email')
  }

  if (content.length < 2 || content.length > 2000) {
    errors.push('content')
  }

  if (input.honeypot) {
    errors.push('honeypot')
  }

  if (!input.token) {
    errors.push('turnstile')
  }

  const startedAt = input.startedAt ? new Date(input.startedAt).getTime() : NaN

  if (!Number.isFinite(startedAt) || now - startedAt < 3000 || now - startedAt > 2 * 60 * 60 * 1000) {
    errors.push('timing')
  }

  return errors
}

export function sanitizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}-]/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function isValidHexColor(value: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
}
