"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

interface MailTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
}

const MailTemplateSelector = () => {
  const [mailTemplates, setMailTemplates] = useState<MailTemplate[]>([]);
  const form = useFormContext(); // Now it won't be null
  const { setValue } = form;

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("/api/mailTemplates"); // Replace with actual API route
        setMailTemplates(response.data);
      } catch (error) {
        console.error("Error fetching mail templates", error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <>
    <h2 className="text-xl font-bold mb-4">Select Mail Template</h2>
      <div className="space-y-4">
        {mailTemplates.map((template) => (
          <div key={template.id} className="border p-4 rounded-md">
            <h3 className="text-lg font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.message}</p>
            <Button
              variant="outline"
              onClick={() => {
                setValue("emailId", template.id);
                setValue("subject", template.subject);
                setValue("message", template.message);
              }}
              className="w-full mt-2"
            >
              Select
            </Button>
          </div>
        ))}
      </div>
    </>
   
  );
};

export default MailTemplateSelector;
