"use server";

import { revalidatePath } from "next/cache";
import List from "../database/models/list.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE a new list
export async function createList(listName: string, userIds: string[]) {
  try {
    await connectToDatabase();

    const newList = await List.create({ listName, userIds }); // Changed 'users' to 'userIds'

    return JSON.parse(JSON.stringify(newList));
  } catch (error) {
    handleError(error);
    throw error;  // Optionally throw the error if you want the caller to handle it too
  }
}

// READ all lists
export async function getAllLists() {
  try {
    await connectToDatabase();
    const lists = await List.find().populate("userIds");
    return JSON.parse(JSON.stringify(lists));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// READ a specific list by ID
export async function getListById(listId: string) {
  try {
    await connectToDatabase();

    const list = await List.findById(listId);

    if (!list) throw new Error("List Not Found");

    return JSON.parse(JSON.stringify(list));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// UPDATE a list (e.g., add users)
export async function updateList(listId: string, userIds: string[]) {
  try {
    await connectToDatabase();

    const updatedList = await List.findByIdAndUpdate(
      listId,
      { $addToSet: { userIds: { $each: userIds } } }, // Changed 'users' to 'userIds'
      { new: true }
    );

    if (!updatedList) throw new Error("List update failed");

    return JSON.parse(JSON.stringify(updatedList));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// JOIN a campaign (e.g., add user to the campaign's list of users)
export async function joinCampaign(listId: string, userId: string) {
  try {
    await connectToDatabase();

    // Update the list by adding the user to the 'userIds' array of the campaign
    const updatedList = await List.findByIdAndUpdate(
      listId,
      { $addToSet: { userIds: userId } }, // Changed 'users' to 'userIds'
      { new: true }
    );

    if (!updatedList) throw new Error("Joining campaign failed");

    return JSON.parse(JSON.stringify(updatedList));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// DELETE a list
export async function deleteList(listId: string) {
  try {
    await connectToDatabase();

    const deletedList = await List.findByIdAndDelete(listId);
    revalidatePath("/");

    return deletedList ? JSON.parse(JSON.stringify(deletedList)) : null;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
