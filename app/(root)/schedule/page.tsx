import ScheduleForm from "@/components/ScheduleForm";
import React from 'react'

const page = () => {
  return (
    <main className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Schedule a Mailing</h1>
      <ScheduleForm />
    </main>
  )
}

export default page