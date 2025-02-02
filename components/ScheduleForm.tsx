"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createMailing } from "@/lib/api";
import MailerSelect from "./MailerSelect";
import ListSelect from "./ListSelect";

export const schema = z.object({
  mailerId: z.string().nonempty("Select a mailer"),
  listId: z.string().nonempty("Select a list"),
  scheduleDate: z.string().nonempty("Pick a date and time"),
});

const ScheduleForm = () => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    await createMailing(data);
    alert("Mailing scheduled successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-gray-100 rounded-lg">
      <div>
        <label className="block text-sm">Select Mailer</label>
        <MailerSelect register={register} />
      </div>
      <div>
        <label className="block text-sm">Select List</label>
        <ListSelect register={register} />
      </div>
      <div>
        <label className="block text-sm">Schedule Date</label>
        <input type="datetime-local" {...register("scheduleDate")} className="p-2 border rounded w-full" />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Schedule
      </button>
    </form>
  );
}
export default ScheduleForm
