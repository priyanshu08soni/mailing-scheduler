import Home from '@/components/shared/Home'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const Page = async() => {
  const user = await auth();
  const userId = user.userId as string;
  return (
    <div>
      <Home userId={userId}/>
    </div>
  )
}

export default Page
