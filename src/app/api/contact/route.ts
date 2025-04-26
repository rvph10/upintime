import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { applyRateLimit } from "@/lib/rate-limit";

// Setup email transporter
const transporter = nodemailer.createTransport({
  host: "smtppro.zoho.eu",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    // Apply rate limiting - 5 requests per minute
    const rateLimitResponse = await applyRateLimit(
      request,
      "contact",
      5,
      "60 s",
    );
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Parse request body
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `Contact Form: ${subject || "New message from website"}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject || "N/A"}

Message:
${message}
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #ebebeb;
  font-family: 'Poppins', sans-serif;
">
  <div style="
    max-width: 600px;
    margin: 40px auto;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  ">
    <!-- Header -->
    <div style="
      background-color: #101010;
      padding: 24px;
      text-align: center;
    ">
      <h2 style="
        color: #ebebeb;
        margin: 0;
        font-size: 22px;
        font-weight: 600;
        letter-spacing: 0.3px;
      ">New Message</h2>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px;">
      <div style="margin-bottom: 24px;">
        <p style="
          margin: 0 0 6px 0;
          color: #6e6e6e;
          font-size: 14px;
          font-weight: 500;
        ">From</p>
        <p style="
          margin: 0;
          color: #101010;
          font-size: 16px;
          font-weight: 500;
        ">${name}</p>
        <p style="
          margin: 4px 0 0 0;
          color: #101010;
          font-size: 14px;
        ">${email}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <p style="
          margin: 0 0 6px 0;
          color: #6e6e6e;
          font-size: 14px;
          font-weight: 500;
        ">Subject</p>
        <p style="
          margin: 0;
          color: #101010;
          font-size: 16px;
        ">${subject || "N/A"}</p>
      </div>

      <div>
        <p style="
          margin: 0 0 6px 0;
          color: #6e6e6e;
          font-size: 14px;
          font-weight: 500;
        ">Message</p>
        <div style="
          background-color: #f8f8f8;
          padding: 16px;
          border-radius: 8px;
          border-left: 3px solid #101010;
        ">
          <p style="
            margin: 0;
            color: #101010;
            font-size: 15px;
            line-height: 1.6;
            white-space: pre-wrap;
          ">${message}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="
      border-top: 1px solid #eee;
      padding: 16px 24px;
      text-align: center;
    ">
      <p style="
        margin: 0;
        color: #6e6e6e;
        font-size: 13px;
      ">UpInTown – Contact Form</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Return success response
    return NextResponse.json({
      message:
        "Your message has been sent successfully! We'll be in touch soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }
}
