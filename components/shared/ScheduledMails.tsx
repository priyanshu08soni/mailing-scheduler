"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllSchedules, deleteSchedule } from "@/lib/actions/schedule.actions";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

type SelectedList = {
  _id: string;
  listName: string;
  createdAt: string;
  updatedAt: string;
  userIds: string[];
};

type Schedule = {
  _id: string;
  emailId: string;
  subject: string;
  message: string;
  sendDate: string; // ISO string format
  selectedLists?: SelectedList[]; // Make sure to include selectedLists
};

const ScheduledMails = () => {
  const [mails, setMails] = useState<Schedule[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchMails() {
      try {
        const schedules = await getAllSchedules();
        setMails(schedules);
      } catch (error) {
        console.error("Failed to fetch mails:", error);
      }
    }
    fetchMails();
  }, []);

  const handleUpdate = (id: string) => {
    router.push(`/mails/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this email?")) return;

    try {
      await deleteSchedule(id);
      setMails((prev) => prev.filter((mail) => mail._id !== id));
    } catch (error) {
      console.error("Error deleting mail:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Scheduled Emails</h2>
      {mails.length === 0 ? (
        <p>No scheduled emails found.</p>
      ) : (
        <div className="space-y-4">
          {mails.map((mail) => {
            const sendDate = new Date(mail.sendDate);
            const isPastDeadline = sendDate < new Date();

            return (
              <div key={mail._id} className="border p-4 rounded-lg shadow-md">
                <p><strong>From:</strong> {mail.emailId}</p>
                <p><strong>Subject:</strong> {mail.subject}</p>
                <p><strong>Message:</strong> {mail.message}</p>
                <p><strong>Send Date:</strong> {format(sendDate, "PPpp")}</p>

                {/* Display Selected Lists */}
                {mail.selectedLists && mail.selectedLists.length > 0 && (
                  <div className="mt-2">
                    <p><strong>Selected Campaigns:</strong></p>
                    <ul className="list-disc ml-5">
                      {mail.selectedLists.map((list) => (
                        <li key={list._id}>
                          {list.listName} (Created: {format(new Date(list.createdAt), "PPpp")})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!isPastDeadline && (
                  <div className="mt-2 flex gap-2">
                    <Button onClick={() => handleUpdate(mail._id)} variant="outline">
                      Update
                    </Button>
                    <Button onClick={() => handleDelete(mail._id)} variant="destructive">
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScheduledMails;
