"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchLists } from "@/lib/api";

const ListSelect = ({ register }: any) => {
  const { data: lists } = useQuery({ queryKey: ["lists"], queryFn: fetchLists });

  return (
    <select {...register("listId")}>
      {lists?.map((list: any) => (
        <option key={list.id} value={list.id}>
          {list.name}
        </option>
      ))}
    </select>
  );
}
export default ListSelect
