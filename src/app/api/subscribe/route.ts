import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Apply rate limiting - 3 requests per minute
    const rateLimitResponse = await applyRateLimit(
      request,
      "subscribe",
      3,
      "60 s",
    );
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    // Your MailerLite API key (store this in .env.local)
    const apiKey = process.env.MAILERLITE_API_KEY;
    if (!apiKey) {
      console.error("Missing MailerLite API key");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Make API request to MailerLite
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          groups: [process.env.MAILERLITE_GROUP_ID], // Optional: specific group ID
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      let errorMsg = "Failed to subscribe";
      if (data.message) errorMsg = data.message;

      // If user is already subscribed, return a friendly message
      if (response.status === 409) {
        return NextResponse.json(
          {
            message: "You're already subscribed to our newsletter!",
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { error: errorMsg },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: "Subscribed successfully! Thank you for joining our newsletter.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
