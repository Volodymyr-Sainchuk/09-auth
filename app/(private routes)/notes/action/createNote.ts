"use server";

import { cookies } from "next/headers";

export interface NewNote {
  title: string;
  content: string;
  tag?: string;
}

export async function createNote(newNote: NewNote) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  try {
    const res = await fetch(`${process.env.API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newNote),
    });

    if (!res.ok) {
      throw new Error(`Failed to create note: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error creating note:", err);
    throw err;
  }
}
