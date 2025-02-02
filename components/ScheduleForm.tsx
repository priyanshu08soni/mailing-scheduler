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

export const formSchema = z.object({
    title: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    repeat: z.string().optional(),
    notes: z.string().optional(),
});

const ScheduleForm = ({ action, data = null, userId }: { action: string, data?: any, userId: string }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const initialValues = data && action === 'Update' ? {
        title: data?.title,
        startDate: data?.startDate,
        endDate: data?.endDate,
        repeat: data?.repeat,
        notes: data?.notes,
    } : {
        title: "",
        startDate: "",
        endDate: "",
        repeat: "none",
        notes: "",
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            if (action === 'Add') {
                console.log("Adding schedule", values);
                // API call to add schedule
            } else if (action === 'Update') {
                console.log("Updating schedule", values);
                // API call to update schedule
            }
            router.push('/schedules');
        } catch (error) {
            console.error(error);
        }

        setIsSubmitting(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <CustomField
                    control={form.control}
                    name='title'
                    formLabel='Schedule Title'
                    className='w-full'
                    render={({ field } : any) => <Input {...field} className='input-field' />}
                />
                <CustomField
                    control={form.control}
                    name='startDate'
                    formLabel='Start Date'
                    className='w-full'
                    render={({ field } : any) => <Input type="date" {...field} className='input-field' />}
                />
                <CustomField
                    control={form.control}
                    name='endDate'
                    formLabel='End Date'
                    className='w-full'
                    render={({ field } : any) => <Input type="date" {...field} className='input-field' />}
                />
                <CustomField
                    control={form.control}
                    name='repeat'
                    formLabel='Repeat Schedule'
                    className='w-full'
                    render={({ field } : any) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="select-field">
                                <SelectValue placeholder="Select recurrence" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                <CustomField
                    control={form.control}
                    name='notes'
                    formLabel='Additional Notes'
                    className='w-full'
                    render={({ field } : any) => <Input {...field} className='input-field' />}
                />
                <Button type="submit" className='submit-button capitalize' disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : action === 'Add' ? 'Create Schedule' : 'Update Schedule'}
                </Button>
            </form>
        </Form>
    );
};

export default ScheduleForm;