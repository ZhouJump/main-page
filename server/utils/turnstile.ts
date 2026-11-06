interface TurnstileResponse {
  success: boolean
  'error-codes'?: string[]
}

export async function verifyTurnstile(token: string, remoteIp: string): Promise<boolean> {
  const config = useRuntimeConfig()
  const secret = config.turnstileSecretKey

  if (!secret) {
    return false
  }

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: remoteIp
  })

  try {
    const result = await $fetch<TurnstileResponse>('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body
    })

    return result.success === true
  } catch {
    return false
  }
}
