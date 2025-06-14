'use server'

import { checkRole } from '@/lib/roles'
import { clerkClient } from '@clerk/nextjs/server'

export async function setRole(formData: FormData) {
  const client = await clerkClient()

  // Check that the user trying to set the role is an admin
  if (!checkRole('teacher')) {
    return { message: 'Not Authorized' }
  }

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { userType: formData.get('userType') },
    })
    return { message: res.publicMetadata }
  } catch (err) {
    return { message: err }
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { userType: null },
    })
    return { message: res.publicMetadata }
  } catch (err) {
    return { message: err }
  }
}