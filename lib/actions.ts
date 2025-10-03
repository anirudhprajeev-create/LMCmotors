
'use server';

import { z } from "zod";
import 'dotenv/config';
import { createSession, deleteSession } from "./session";
import { redirect } from 'next/navigation'

export async function submitInquiry(prevState: any, formData: FormData) {
  const inGameName = formData.get("inGameName") as string;
  const inGamePhoneNumber = formData.get("inGamePhoneNumber") as string;
  const message = formData.get("message") as string;
  const vehicle = formData.get("vehicle") as string;
  // const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const webhookUrl = "https://discord.com/api/webhooks/1422840600863965245/1z_IkFpLFQo1SHZEnl9mEgKMHDWuB5Xte7bDhi6PvKg6SOGtRi1Db3ZgdkQaTW0GlH1a";

  if (webhookUrl) {
    const discordMessage = {
      embeds: [{
        title: "New Vehicle Inquiry! 🚗",
        color: 5814783,
        fields: [
          { name: "Vehicle", value: vehicle, inline: false },
          { name: "Ingame Name", value: inGameName, inline: true },
          { name: "Ingame Phone Number", value: inGamePhoneNumber || 'Not Provided', inline: true },
          { name: "Message", value: message, inline: false },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "LMC Motors Inquiry System"
        }
      }]
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordMessage),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Discord webhook failed:", response.status, errorText);
        // We don't want to block the user flow if Discord fails, so we won't return an error message here
      }

    } catch (error) {
      console.error("Failed to send Discord notification:", error);
      // We don't want to block the user flow if Discord fails.
    }
  } else {
    console.warn("DISCORD_WEBHOOK_URL not set. Skipping notification.");
  }

  return {
    message: "Success! Your inquiry has been sent.",
    errors: {},
  };
}

const prebookSchema = z.object({
  inGameName: z.string().min(2, "In-game name must be at least 2 characters."),
  discordId: z.string().min(2, "Discord ID must be at least 2 characters."),
  inGameNumber: z.string().optional(),
  pickupTime: z.string().nonempty("Please select a pickup time."),
  vehicle: z.string(),
  price: z.coerce.number().positive("Price must be a positive number."),
});

function formatPriceForDiscord(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export async function prebookVehicle(prevState: any, formData: FormData) {
    const validatedFields = prebookSchema.safeParse({
        inGameName: formData.get("inGameName"),
        discordId: formData.get("discordId"),
        inGameNumber: formData.get("inGameNumber"),
        pickupTime: formData.get("pickupTime"),
        vehicle: formData.get("vehicle"),
        price: formData.get("price"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error: Please check the form fields.",
        };
    }

    // In a real application, you would save this pre-booking to a database.
    console.log("New Pre-booking Received:", validatedFields.data);
    
    const { inGameName, discordId, inGameNumber, pickupTime, vehicle, price } = validatedFields.data;
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (webhookUrl) {
      const discordMessage = {
        embeds: [{
          title: "New Vehicle Pre-booking! 🚗",
          color: 5814783,
          fields: [
            { name: "Vehicle", value: vehicle, inline: false },
            { name: "Price", value: formatPriceForDiscord(price), inline: false },
            { name: "In-Game Name", value: inGameName, inline: true },
            { name: "Discord ID", value: discordId, inline: true },
            { name: "In-Game Number", value: inGameNumber || 'Not Provided', inline: true },
            { name: "Pickup Time", value: `${pickupTime} (approx. 20 min window)`, inline: false },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "LMC Motors Pre-booking System"
          }
        }]
      };

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(discordMessage),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Discord webhook failed:", response.status, errorText);
            // We don't want to block the user flow if Discord fails, so we won't return an error message here
        }

      } catch (error) {
        console.error("Failed to send Discord notification:", error);
        // We don't want to block the user flow if Discord fails.
      }
    } else {
        console.warn("DISCORD_WEBHOOK_URL not set. Skipping notification.");
    }


    return {
        message: `Success! You've pre-booked the ${validatedFields.data.vehicle}. We will contact you shortly.`,
        errors: {},
    };
}


const loginSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please enter a password.",
    };
  }

  const { password } = validatedFields.data;

  if (password === process.env.ADMIN_PASSWORD) {
    await createSession();
    redirect('/admin/dashboard');
  } else {
    return {
      message: "Invalid password.",
      errors: {},
    };
  }
}

export async function logout() {
    await deleteSession();
    redirect('/admin/login');
}
