import ScheduleForm from '@/components/ScheduleForm'
import React from 'react'

const Schedule = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Schedule a Mailing</h1>
      <ScheduleForm action={''} userId={''} />
    </div>
  )
}

export default Schedule
