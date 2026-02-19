import { NextRequest, NextResponse } from "next/server";
import { submitBookingData } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      resortName,
      contactNumber,
      numberOfRooms,
      email,
      numberOfHotels,
      address,
      message,
      // recaptchaToken,
    } = body;

    // Verify reCAPTCHA
    // const recaptchaResponse = await fetch(
    //   `https://www.google.com/recaptcha/api/siteverify`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    //   }
    // );

    // const recaptchaData = await recaptchaResponse.json();

    // if (!recaptchaData.success) {
    //   return NextResponse.json(
    //     { message: "reCAPTCHA verification failed" },
    //     { status: 400 }
    //   );
    // }

    // Store data in database
    const result = await submitBookingData({
      appName: "app3534482538357",
      moduleName: "beacocotel",
      body: {
        sectionData: {
          beacocotel: {
            full_name: fullName,
            resort_name: resortName,
            contact_number: contactNumber,
            number_of_rooms: numberOfRooms,
            email: email,
            number_of_hotels: numberOfHotels,
            address: address,
            message: message,
            created_at: new Date().toISOString(),
          },
        },
      },
    });

    if (!result.success) {
      throw new Error(result.message || "Failed to store data");
    }

    // Send email via Elastic Email
    const emailResponse = await fetch("https://api.elasticemail.com/v2/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        apikey: process.env.ELASTIC_EMAIL_API_KEY || "",
        from: "admin@cocotel.com.ph",
        fromName: "Cocotel Admin",
        to: "jayashriraidlayer@gmail.com",
        subject: "New Partner Inquiry - Cocotel",
        bodyHtml: `
          <h1>Cocotel Partner</h1>
          <h4>Full Name: ${fullName}</h4>
          <h4>Contact Number: ${contactNumber}</h4>
          <h4>Email: ${email}</h4>
          <h4>Location: ${address}</h4>
          <h4>Resort Name: ${resortName}</h4>
          <h4>Number Of Rooms: ${numberOfRooms}</h4>
          <h4>Number Of Hotels: ${numberOfHotels}</h4>
          <h4>Message: ${message}</h4>
        `,
        isTransactional: "false",
      }).toString(),
    });

    const emailResult = await emailResponse.json();
    console.log("Email send result:", emailResult);

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult);
    }

    return NextResponse.json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
