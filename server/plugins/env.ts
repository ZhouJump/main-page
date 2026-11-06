import { assertEnv } from '../../shared/utils/env'

export default defineNitroPlugin(() => {
  if (import.meta.env.DEV) {
    return
  }

  assertEnv(process.env)
})
