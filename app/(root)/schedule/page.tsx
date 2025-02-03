import ScheduleForm from '@/components/shared/ScheduleForm'
import React from 'react'

const Schedule = () => {
  return (
    <>
    <div className='p-4'>
      <h1 className="text-2xl font-bold mb-4 text-center">Schedule a Mail</h1>
      <ScheduleForm action={''} userId={''} />
    </div>
    </>
  )
}

export default Schedule
