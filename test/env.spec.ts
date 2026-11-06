import { describe, expect, it } from 'vitest'
import { findMissingEnv } from '../shared/utils/env'

describe('findMissingEnv', () => {
  it('完整时返回空数组', () => {
    expect(
      findMissingEnv({
        DATABASE_URL: 'postgresql://localhost/db',
        NUXT_APP_SECRET: 'a'.repeat(32)
      })
    ).toEqual([])
  })

  it('缺失时报告变量名', () => {
    expect(findMissingEnv({})).toEqual(['DATABASE_URL', 'NUXT_APP_SECRET'])
  })

  it('会话密钥过短视为缺失', () => {
    expect(
      findMissingEnv({
        DATABASE_URL: 'postgresql://localhost/db',
        NUXT_APP_SECRET: 'short'
      })
    ).toEqual(['NUXT_APP_SECRET'])
  })

  it('空白值视为缺失', () => {
    expect(
      findMissingEnv({
        DATABASE_URL: '   ',
        NUXT_APP_SECRET: 'a'.repeat(32)
      })
    ).toEqual(['DATABASE_URL'])
  })
})
