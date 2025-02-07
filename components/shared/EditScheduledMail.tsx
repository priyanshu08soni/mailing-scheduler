"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomField } from "@/components/shared/CustomField";
import Recipients from "@/components/shared/Recipients";
import { getScheduleById, updateSchedule } from "@/lib/actions/schedule.actions";
import { getUserById } from "@/lib/actions/user.action";

const formSchema = z.object({
  emailId: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  sendDate: z.string().min(1, "Send date is required"),
  selectedLists: z.array(z.string()).default([]),
});

// Utility function to format ISO date to "yyyy-MM-ddTHH:mm"
const formatDateForInput = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16); // Extract "yyyy-MM-ddTHH:mm"
};

const EditScheduledMail = ({ userId }: { userId: string }) => {
  const params = useParams(); // Get email ID from URL
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false); // Flag to track if the data has been fetched

  const [user, setUser] = useState<{ email?: string } | null>(null);
  const router = useRouter();
  const id = params.id as string;

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailId: "",
      subject: "",
      message: "",
      sendDate: "",
      selectedLists: [],
    },
  });

  // Fetch existing email details
  useEffect(() => {
    const fetchEmailDetails = async () => {
      try {
        const scheduledMail = await getScheduleById(id);
        if (scheduledMail) {
          formMethods.reset({
            ...scheduledMail,
            sendDate: formatDateForInput(scheduledMail.sendDate), // Format date properly
          });
          setSelectedLists(scheduledMail.selectedLists);
        }
      } catch (error) {
        console.error("Failed to fetch email:", error);
      }
      setIsLoading(false);
    };

    fetchEmailDetails();
  }, [id]);

  const fetchUserEmail = async () => {
    try {
      const user = await getUserById(userId);
      setUser(user);

      if (user?.email && formMethods.getValues("emailId") !== user.email) {
        formMethods.setValue("emailId", user.email, { shouldDirty: false, shouldValidate: false });
      }
    } catch (error) {
      console.error("Failed to fetch email:", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserEmail(); // Set flag to prevent re-fetching
    }
  }, [userId]); // Effect runs only when userId or hasFetched changes

  


  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await updateSchedule(id, values);
      router.push("/mails");
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  }

  return (
    <FormProvider {...formMethods}>
      <div className="grid grid-cols-3 gap-4">
        {/* Recipients (Lists) */}
        <div className="xl:col-span-1 md:col-span-3 sm:col-span-3 p-4 bg-white rounded-lg">
          <Recipients
            preselectedLists={selectedLists}
            onSelectLists={(selectedMap: { [key: string]: boolean }) => {
              const selectedIds = Object.keys(selectedMap).filter((id) => selectedMap[id]);
              setSelectedLists(selectedIds);
              formMethods.setValue("selectedLists", selectedIds); // Update form value
            }}
          />
        </div>

        {/* Email Form */}
        <div className="xl:col-span-1 md:col-span-3 sm:col-span-3 p-4">
          <Form {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-8">
              {/* Email Field (Non-editable) */}
              <CustomField
                control={formMethods.control}
                name="emailId"
                formLabel="Your Email"
                render={({ field }) => <Input {...field} className="input-field" disabled />}
              />

              {/* Subject */}
              <CustomField
                control={formMethods.control}
                name="subject"
                formLabel="Subject"
                render={({ field }) => <Input {...field} className="input-field" />}
              />

              {/* Message */}
              <CustomField
                control={formMethods.control}
                name="message"
                formLabel="Message"
                render={({ field }) => <Input {...field} className="input-field" />}
              />

              {/* Send Date */}
              <CustomField
                control={formMethods.control}
                name="sendDate"
                formLabel="Send Date"
                render={({ field }) => (
                  <Input type="datetime-local" {...field} value={formatDateForInput(field.value)} className="input-field" />
                )}
              />

              <Button type="submit" className="submit-button capitalize" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Schedule"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </FormProvider>
  );
};

export default EditScheduledMail;
