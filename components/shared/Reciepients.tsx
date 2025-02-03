"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

type Person = {
  id: string;
  name: string;
  email: string;
};

type List = {
  id: string;
  name: string;
  people: Person[];
};

const Reciepients = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [expandedLists, setExpandedLists] = useState<{ [key: string]: boolean }>({});
  const [selectedLists, setSelectedLists] = useState<{ [key: string]: boolean }>({});
  const [selectedPeople, setSelectedPeople] = useState<{ [key: string]: Set<string> }>({});

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get("/api/lists");
        setLists(response.data);
      } catch (error) {
        console.error("Error fetching lists", error);
      }
    };
    fetchLists();
  }, []);

  // Toggle list expansion
  const toggleList = (listId: string) => {
    setExpandedLists((prev) => ({
      ...prev,
      [listId]: !prev[listId],
    }));
  };

  // Handle list selection (check/uncheck the list)
  const handleListSelection = (listId: string) => {
    const isSelected = selectedLists[listId];

    setSelectedLists((prev) => ({
      ...prev,
      [listId]: !isSelected,
    }));

    setSelectedPeople((prev) => ({
      ...prev,
      [listId]: isSelected ? new Set() : new Set(lists.find((list) => list.id === listId)?.people.map((p) => p.id) || []),
    }));
  };

  // Handle individual person selection inside a list
  const handlePersonSelection = (listId: string, personId: string) => {
    setSelectedPeople((prev) => {
      const updatedPeople = new Set(prev[listId] || []);
      if (updatedPeople.has(personId)) {
        updatedPeople.delete(personId);
      } else {
        updatedPeople.add(personId);
      }

      return {
        ...prev,
        [listId]: updatedPeople,
      };
    });
  };

  return (
    <>
    <h2 className="text-lg font-semibold mb-4">Select Email List</h2>
      <div className="space-y-3">
        {lists.map((list) => (
          <div key={list.id} className="border p-2 rounded-md">
            {/* List Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`list-${list.id}`}
                checked={selectedLists[list.id] || false}
                onChange={() => handleListSelection(list.id)}
                className="w-4 h-4"
              />
              <label htmlFor={`list-${list.id}`} className="font-medium cursor-pointer">
                {list.name}
              </label>
              <button
                onClick={() => toggleList(list.id)}
                className="ml-auto text-sm text-blue-500 underline"
              >
                {expandedLists[list.id] ? "Hide" : "Show"}
              </button>
            </div>

            {/* People Dropdown (if list is expanded) */}
            {expandedLists[list.id] && (
              <div className="mt-2 pl-6 border-l border-gray-300">
                {list.people.map((person) => (
                  <div key={person.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`person-${person.id}`}
                      checked={selectedPeople[list.id]?.has(person.id) || false}
                      onChange={() => handlePersonSelection(list.id, person.id)}
                      className="w-4 h-4"
                    />
                    <label htmlFor={`person-${person.id}`} className="cursor-pointer">
                      {person.name} ({person.email})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>

  );
};

export default Reciepients;
