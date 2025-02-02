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
    listId: z.string().optional(),
    emailId: z.string().optional(),
    subject: z.string(),
    message: z.string(),
    sendDate: z.string(),
});

const MailSchedulePage = ({ action, data = null, userId }: { action: string, data?: any, userId: string }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [mailers, setMailers] = useState<any[]>([]);
    const [lists, setLists] = useState<any[]>([]);
    const [emails, setEmails] = useState<any[]>([]); // List of people

    const initialValues = data && action === 'Update' ? {
        listId: data?.listId,
        emailId: data?.emailId,
        subject: data?.subject,
        message: data?.message,
        sendDate: data?.sendDate,
    } : {
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
        <div className="grid grid-cols-3 gap-4">
            {/* First Part: Mailers (20%) */}
            <div className="col-span-1 p-4">
                <h2 className="text-xl font-bold mb-4">Select Mail Template</h2>
                <div className="space-y-4">
                    {mailers.map((mailer) => (
                        <Button
                            key={mailer.id}
                            variant="outline"
                            onClick={() => form.setValue('emailId', mailer.id)}
                            className="w-full"
                        >
                            {mailer.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Second Part: Email Form and Schedule (60%) */}
            <div className="col-span-2 p-4">
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
            </div>

            {/* Third Part: People Lists (20%) */}
            <div className="col-span-1 p-4">
                <h2 className="text-xl font-bold mb-4">Select Recipients</h2>
                <div className="space-y-4">
                    {lists.map((list) => (
                        <div key={list.id} className="space-y-2">
                            <h3 className="text-lg font-semibold">{list.name}</h3>
                            <Select
                                onValueChange={(value) => form.setValue('listId', value)}
                                value={form.watch('listId')}
                            >
                                <SelectTrigger className="select-field">
                                    <SelectValue placeholder="Select a List" />
                                </SelectTrigger>
                                <SelectContent>
                                    {list.people.map((person : any) => (
                                        <SelectItem key={person.id} value={person.id}>
                                            {person.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                onClick={() => form.setValue('emailId', list.people[0]?.id)}
                                className="w-full"
                            >
                                Select First Person
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MailSchedulePage;
