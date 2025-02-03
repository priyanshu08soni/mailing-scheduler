import { NextRequest, NextResponse } from "next/server";

let mailTemplates = [
  { id: "1", name: "Welcome Email", subject: "Welcome to Our Service", message: "Thank you for signing up!" },
  { id: "2", name: "Newsletter", subject: "Monthly Updates", message: "Here are the latest updates from our company." },
  { id: "3", name: "Discount Offer", subject: "Exclusive Discount Inside", message: "Get 20% off on your next purchase." },
];

// GET: Fetch all mail templates
export async function GET() {
  return NextResponse.json(mailTemplates);
}

// POST: Add a new mail template
export async function POST(req: NextRequest) {
  try {
    const { name, subject, message } = await req.json();
    const newTemplate = { id: `${mailTemplates.length + 1}`, name, subject, message };
    mailTemplates.push(newTemplate);
    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// PUT: Update an existing mail template
export async function PUT(req: NextRequest) {
  try {
    const { id, name, subject, message } = await req.json();
    mailTemplates = mailTemplates.map((template) =>
      template.id === id ? { id, name, subject, message } : template
    );
    return NextResponse.json({ message: "Template updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE: Remove a mail template
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    mailTemplates = mailTemplates.filter((template) => template.id !== id);
    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
