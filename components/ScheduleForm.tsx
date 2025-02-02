"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from "zod";

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomField } from './CustomField';

import { useRouter } from 'next/navigation';
import axios from 'axios';

// Schema for validating the form inputs
export const formSchema = z.object({
    mailerId: z.string(),
    listId: z.string().optional(),
    emailId: z.string().optional(),
    subject: z.string(),
    message: z.string(),
    sendDate: z.string(),
});

const MailScheduleForm = ({ action, data = null, userId }: { action: string, data?: any, userId: string }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [mailers, setMailers] = useState<any[]>([]);
    const [lists, setLists] = useState<any[]>([]);
    const [emails, setEmails] = useState<any[]>([]); // List of people

    const initialValues = data && action === 'Update' ? {
        mailerId: data?.mailerId,
        listId: data?.listId,
        emailId: data?.emailId,
        subject: data?.subject,
        message: data?.message,
        sendDate: data?.sendDate,
    } : {
        mailerId: "",
        listId: "",
        emailId: "",
        subject: "",
        message: "",
        sendDate: "",
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    });

    // Fetch mailers, lists, and people (emails)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mailersResponse, listsResponse, emailsResponse] = await Promise.all([
                    axios.get('/api/mailers'),
                    axios.get('/api/lists'),
                    axios.get('/api/emails'), // API endpoint for emails/people
                ]);
                setMailers(mailersResponse.data);
                setLists(listsResponse.data);
                setEmails(emailsResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    // Handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            if (action === 'Add') {
                console.log("Adding mail schedule", values);
                // API call to add mail schedule
            } else if (action === 'Update') {
                console.log("Updating mail schedule", values);
                // API call to update mail schedule
            }
            router.push('/mails'); // Redirect after submission
        } catch (error) {
            console.error(error);
        }

        setIsSubmitting(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Subject */}
                <CustomField
                    control={form.control}
                    name='subject'
                    formLabel='Subject'
                    className='w-full'
                    render={({ field }: any) => <Input {...field} className='input-field' />}
                />
                
                {/* Message */}
                <CustomField
                    control={form.control}
                    name='message'
                    formLabel='Message'
                    className='w-full'
                    render={({ field }: any) => <Input {...field} className='input-field' />}
                />

                {/* Mailer Template */}
                <CustomField
                    control={form.control}
                    name='mailerId'
                    formLabel='Mailer Template'
                    className='w-full'
                    render={({ field }: any) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="select-field">
                                <SelectValue placeholder="Select a Mailer Template" />
                            </SelectTrigger>
                            <SelectContent>
                                {mailers.map((mailer) => (
                                    <SelectItem key={mailer.id} value={mailer.id}>
                                        {mailer.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Recipient List */}
                <CustomField
                    control={form.control}
                    name='listId'
                    formLabel='Recipient List'
                    className='w-full'
                    render={({ field }: any) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="select-field">
                                <SelectValue placeholder="Select a List" />
                            </SelectTrigger>
                            <SelectContent>
                                {lists.map((list) => (
                                    <SelectItem key={list.id} value={list.id}>
                                        {list.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Individual Email */}
                <CustomField
                    control={form.control}
                    name='emailId'
                    formLabel='Recipient (Individual)'
                    className='w-full'
                    render={({ field }: any) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="select-field">
                                <SelectValue placeholder="Select an Individual" />
                            </SelectTrigger>
                            <SelectContent>
                                {emails.map((email) => (
                                    <SelectItem key={email.id} value={email.id}>
                                        {email.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Send Date */}
                <CustomField
                    control={form.control}
                    name='sendDate'
                    formLabel='Send Date'
                    className='w-full'
                    render={({ field }: any) => <Input type="datetime-local" {...field} className='input-field' />}
                />

                <Button type="submit" className='submit-button capitalize' disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : action === 'Add' ? 'Create Schedule' : 'Update Schedule'}
                </Button>
            </form>
        </Form>
    );
};

export default MailScheduleForm;
