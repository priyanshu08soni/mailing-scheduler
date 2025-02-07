import ScheduleForm from '@/components/shared/ScheduleForm'
import { auth } from '@clerk/nextjs/server';
import React from 'react'

const Schedule = async() => {
  const user = await auth();
  const userId = user.userId as string;
  return (
    <>
    <div className='p-4'>
      <h1 className="text-2xl font-bold mb-4 text-center">Schedule a Mail</h1>
      <ScheduleForm userId={userId} />
    </div>
    </>
  )
}

export default Schedule
