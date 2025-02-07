import EditScheduledMail from '@/components/shared/EditScheduledMail'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const page = async() => {
  const user = await auth();
  const userId = user.userId as string;
  return (
    <div>
      <EditScheduledMail userId = {userId}/>
    </div>
  )
}

export default page
