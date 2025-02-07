"use client";

import React, { useState, useEffect } from "react";
import { getAllLists } from "@/lib/actions/list.action";
import mongoose from "mongoose";

type List = {
  _id: mongoose.Types.ObjectId;
  listName: string;
};

const Recipients = ({
  onSelectLists,
  preselectedLists = [],
}: {
  onSelectLists: (selected: { [key: string]: boolean }) => void;
  preselectedLists?: string[];
}) => {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedLists, setSelectedLists] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const fetchedLists = await getAllLists();
        setLists(fetchedLists);

        // Initialize selected lists based on preselectedLists
        const initialSelected: { [key: string]: boolean } = {};
        preselectedLists.forEach((id) => (initialSelected[id] = true));
        setSelectedLists(initialSelected);

        // Only call this function if preselectedLists is not empty
        if (preselectedLists.length > 0) {
          onSelectLists(initialSelected);
        }
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchLists();
  }, []); // Removed onSelectLists from dependencies

  // Handle list selection (check/uncheck the list)
  const handleListSelection = (listId: mongoose.Types.ObjectId) => {
    setSelectedLists((prev) => {
      const updatedLists = { ...prev, [listId.toString()]: !prev[listId.toString()] };
      onSelectLists(updatedLists);
      return updatedLists;
    });
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Select Email List</h2>
      <div className="space-y-3">
        {lists.map((list) => (
          <div key={list._id.toString()} className="border p-2 rounded-md">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`list-${list._id.toString()}`}
                checked={selectedLists[list._id.toString()] || false}
                onChange={() => handleListSelection(list._id)}
                className="w-4 h-4"
              />
              <label htmlFor={`list-${list._id.toString()}`} className="font-medium cursor-pointer">
                {list.listName}
              </label>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Recipients;
