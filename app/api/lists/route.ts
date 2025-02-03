// app/api/lists/route.ts

import { NextResponse } from 'next/server';

// Define the types for the lists and people data
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

const lists: List[] = [
    {
        id: '1',
        name: 'Marketing Team',
        people: [
            { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
            { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
            { id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com' },
        ],
    },
    {
        id: '2',
        name: 'Development Team',
        people: [
            { id: '4', name: 'Bob Brown', email: 'bob.brown@example.com' },
            { id: '5', name: 'Charlie White', email: 'charlie.white@example.com' },
            { id: '6', name: 'David Green', email: 'david.green@example.com' },
        ],
    },
    {
        id: '3',
        name: 'HR Team',
        people: [
            { id: '7', name: 'Emily Davis', email: 'emily.davis@example.com' },
            { id: '8', name: 'Frank Harris', email: 'frank.harris@example.com' },
        ],
    },
];

export async function GET() {
    return NextResponse.json(lists);
}
