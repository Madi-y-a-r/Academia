import { Roles } from "@/types"
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth()
  const metadata = sessionClaims?.metadata as { role?: string }
  return metadata?.role === role
}