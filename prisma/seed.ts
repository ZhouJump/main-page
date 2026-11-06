import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const username = process.env.ADMIN_USERNAME?.trim()
  const password = process.env.ADMIN_PASSWORD?.trim()

  if (!username || !password) {
    throw new Error('ADMIN_USERNAME 与 ADMIN_PASSWORD 必须配置')
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash }
  })

  console.log(`管理员已就绪: ${username}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
