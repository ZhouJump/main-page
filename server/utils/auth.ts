import bcrypt from 'bcryptjs'

export async function authenticateAdmin(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return null
  }

  const valid = await bcrypt.compare(password, user.passwordHash)

  return valid ? { id: user.id, username: user.username } : null
}
