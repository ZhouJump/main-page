export interface EnvRequirement {
  key: string
  minLength?: number
}

export const REQUIRED_ENV: EnvRequirement[] = [
  { key: 'DATABASE_URL' },
  { key: 'NUXT_APP_SECRET', minLength: 32 }
]

/** 返回缺失或不满足长度要求的环境变量名 */
export function findMissingEnv(env: Record<string, string | undefined>, requirements = REQUIRED_ENV): string[] {
  return requirements
    .filter(({ key, minLength }) => {
      const value = env[key]?.trim()

      if (!value) {
        return true
      }

      return Boolean(minLength && value.length < minLength)
    })
    .map(({ key }) => key)
}

export function assertEnv(env: Record<string, string | undefined>, requirements = REQUIRED_ENV): void {
  const missing = findMissingEnv(env, requirements)

  if (missing.length > 0) {
    throw new Error(`缺少必需的环境变量: ${missing.join(', ')}`)
  }
}
