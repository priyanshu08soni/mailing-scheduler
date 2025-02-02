"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchMailers } from "@/lib/api";

export default function MailerSelect({ register }: any) {
  const { data: mailers } = useQuery({ queryKey: ["mailers"], queryFn: fetchMailers });

  return (
    <select {...register("mailerId")}>
      {mailers?.map((mailer: any) => (
        <option key={mailer.id} value={mailer.id}>
          {mailer.name}
        </option>
      ))}
    </select>
  );
}
