"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { CustomField } from "./CustomField";
import { useRouter } from "next/navigation";
import Recipients from "./Recipients";
import MailTemplateSelector from "./MailTemplateSelector";
import { getUserById } from "@/lib/actions/user.action";
import { createSchedule } from "@/lib/actions/schedule.actions";

// Schema for form validation
export const formSchema = z.object({
  selectedLists: z.array(z.string()), // Expect an array of string IDs
  emailId: z.string().optional(),
  subject: z.string(),
  message: z.string(),
  sendDate: z.string(),
});

const MailSchedulePage = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false); // New state for reloading email
  const router = useRouter();

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedLists: [], // Initialize as empty array
      emailId: "",
      subject: "",
      message: "",
      sendDate: "",
    },
  });

  // Function to fetch user email
  const fetchUserEmail = async () => {
    setIsLoadingEmail(true);
    try {
      const user = await getUserById(userId);
      setUser(user);
      if (user?.email) {
        formMethods.setValue("emailId", user.email);
      }
    } catch (error) {
      console.error("Failed to fetch email:", error);
    }
    setIsLoadingEmail(false);
  };

  useEffect(() => {
    fetchUserEmail(); // Fetch email on mount
  }, [userId]);

  useEffect(() => {
    formMethods.setValue("selectedLists", selectedLists);
  }, [selectedLists, formMethods]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await createSchedule(
        values.emailId || "",
        values.subject,
        values.message,
        values.sendDate,
        values.selectedLists
      );
      router.push("/mails");
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
    setIsSubmitting(false);
  }

  return (
    <FormProvider {...formMethods}>
      <div className="grid grid-cols-3 gap-4">
        {/* Recipients (Lists) */}
        <div className="xl:col-span-1 md:col-span-3 sm:col-span-3 p-4 bg-white rounded-lg">
          <Recipients
            onSelectLists={(selectedMap: { [key: string]: boolean }) => {
              const selectedIds = Object.keys(selectedMap).filter((id) => selectedMap[id]);
              setSelectedLists(selectedIds);
            }}
          />
        </div>

        {/* Email Form */}
        <div className="xl:col-span-1 md:col-span-3 sm:col-span-3 p-4">
          <Form {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-8">
              {/* Email Field with Reload Button */}
              <div className="flex items-center gap-2">
                <CustomField
                  control={formMethods.control}
                  name="emailId"
                  formLabel="Your Email"
                  render={({ field }) => <Input {...field} className="input-field flex-1" disabled />}
                />
                <Button
                  type="button"
                  onClick={fetchUserEmail}
                  disabled={isLoadingEmail}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-gray-900 hover:bg-gray-100 text-sm hover:text-black"
                >
                  {isLoadingEmail ? "Loading..." : "Reload Email"}
                </Button>
              </div>

              <CustomField
                control={formMethods.control}
                name="subject"
                formLabel="Subject"
                render={({ field }) => <Input {...field} className="input-field" />}
              />

              <CustomField
                control={formMethods.control}
                name="message"
                formLabel="Message"
                render={({ field }) => <Input {...field} className="input-field" />}
              />

              <CustomField
                control={formMethods.control}
                name="sendDate"
                formLabel="Send Date"
                render={({ field }) => <Input type="datetime-local" {...field} className="input-field" />}
              />

              <Button type="submit" className="submit-button capitalize" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Create Schedule"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Mail Templates */}
        <div className="xl:col-span-1 md:col-span-3 sm:col-span-3 shadow-md p-4">
          <MailTemplateSelector />
        </div>
      </div>
    </FormProvider>
  );
};

export default MailSchedulePage;