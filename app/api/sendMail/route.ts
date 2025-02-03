import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Define request schema
const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  message: z.string(),
});

// Email sending function
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = emailSchema.parse(body);

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can change this based on your provider
      auth: {
        user: process.env.EMAIL_USER, // Use env variables
        pass: process.env.EMAIL_PASS,
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: validatedData.to,
      subject: validatedData.subject,
      text: validatedData.message,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
