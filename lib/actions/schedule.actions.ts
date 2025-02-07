"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import Schedule from "@/lib/database/models/schedule.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// **CREATE a new schedule**
export async function createSchedule(
  emailId: string,
  subject: string,
  message: string,
  sendDate: string,
  selectedLists: string[]
) {
  try {
    await connectToDatabase();

    const newSchedule = await Schedule.create({
      emailId,
      subject,
      message,
      sendDate: new Date(sendDate),
      selectedLists: selectedLists.map((id) => new mongoose.Types.ObjectId(id)),
    });

    revalidatePath("/mails");
    return JSON.parse(JSON.stringify(newSchedule));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// **READ all schedules**
export async function getAllSchedules() {
  try {
    await connectToDatabase();
    const schedules = await Schedule.find().populate("selectedLists");
    return JSON.parse(JSON.stringify(schedules));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// **READ a specific schedule by ID**
export async function getScheduleById(scheduleId: string) {
  try {
    await connectToDatabase();

    const schedule = await Schedule.findById(scheduleId).populate("selectedLists");
    if (!schedule) throw new Error("Schedule Not Found");

    return JSON.parse(JSON.stringify(schedule));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// **UPDATE a schedule**
export async function updateSchedule(
  scheduleId: string,
  updatedData: {
    emailId?: string;
    subject?: string;
    message?: string;
    sendDate?: string;
    selectedLists?: string[];
  }
) {
  try {
    await connectToDatabase();

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      {
        ...(updatedData.emailId && { emailId: updatedData.emailId }),
        ...(updatedData.subject && { subject: updatedData.subject }),
        ...(updatedData.message && { message: updatedData.message }),
        ...(updatedData.sendDate && { sendDate: new Date(updatedData.sendDate) }),
        ...(updatedData.selectedLists && {
          selectedLists: updatedData.selectedLists.map((id) => new mongoose.Types.ObjectId(id)),
        }),
      },
      { new: true }
    );

    if (!updatedSchedule) throw new Error("Schedule update failed");

    revalidatePath("/mails");
    return JSON.parse(JSON.stringify(updatedSchedule));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// **DELETE a schedule**
export async function deleteSchedule(scheduleId: string) {
  try {
    await connectToDatabase();

    const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId);
    revalidatePath("/mails");

    return deletedSchedule ? JSON.parse(JSON.stringify(deletedSchedule)) : null;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
