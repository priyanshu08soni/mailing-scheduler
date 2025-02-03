"use client";

import React, { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { CustomField } from "./CustomField";
import { useRouter } from "next/navigation";
import EmailListSelector from "./Reciepients";
import MailTemplateSelector from "./MailTemplateSelector";

// Schema for validating the form inputs
export const formSchema = z.object({
  listId: z.string().optional(),
  emailId: z.string().optional(),
  subject: z.string(),
  message: z.string(),
  sendDate: z.string(),
});

const MailSchedulePage = ({
  action,
  data = null,
}: {
  action: string;
  data?: any;
  userId: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const initialValues =
    data && action === "Update"
      ? {
          listId: data?.listId,
          emailId: data?.emailId,
          subject: data?.subject,
          message: data?.message,
          sendDate: data?.sendDate,
        }
      : {
          listId: "",
          emailId: "",
          subject: "",
          message: "",
          sendDate: "",
        };

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      if (action === "Add") {
        console.log("Adding mail schedule", values);
        // API call to add mail schedule
      } else if (action === "Update") {
        console.log("Updating mail schedule", values);
        // API call to update mail schedule
      }
      router.push("/mails"); // Redirect after submission
    } catch (error) {
      console.error(error);
    }

    setIsSubmitting(false);
  }

  return (
    <FormProvider {...formMethods}>
      <div className="grid grid-cols-3 gap-4">
        {/* Third Part: People Lists (20%) */}
        <div className="xl:col-span-1 md:col-span-3 sm:col-span-3 p-4 bg-white rounded-lg">
          <EmailListSelector />
        </div>

        {/* Second Part: Email Form and Schedule (60%) */}
        <div className="xl:col-span-1 md:col-span-3 sm:col-span-3 p-4">
          <Form {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Subject */}
              <CustomField
                control={formMethods.control}
                name="subject"
                formLabel="Subject"
                className="w-full"
                render={({ field }: any) => (
                  <Input {...field} className="input-field" />
                )}
              />

              {/* Message */}
              <CustomField
                control={formMethods.control}
                name="message"
                formLabel="Message"
                className="w-full"
                render={({ field }: any) => (
                  <Input {...field} className="input-field" />
                )}
              />

              {/* Send Date */}
              <CustomField
                control={formMethods.control}
                name="sendDate"
                formLabel="Send Date"
                className="w-full"
                render={({ field }: any) => (
                  <Input
                    type="datetime-local"
                    {...field}
                    className="input-field"
                  />
                )}
              />

              <Button
                type="submit"
                className="submit-button capitalize"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : action === "Add"
                  ? "Create Schedule"
                  : "Update Schedule"}
              </Button>
            </form>
          </Form>
        </div>

        {/* First Part: Mailers (20%) */}
        <div className="xl:col-span-1 md:col-span-3 sm:col-span-3 shadow-md p-4">
          <MailTemplateSelector />
        </div>
      </div>
    </FormProvider>
  );
};

export default MailSchedulePage;
