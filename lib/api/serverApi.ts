"use server";

import { cookies } from "next/headers";
import { Note } from "@/types/note";
import { User } from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// -------------------- Notes --------------------

export interface FetchNotesParams {
  query?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

export async function fetchNotes(params?: FetchNotesParams) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) throw new Error("Unauthorized: accessToken not found");

  const queryParams = new URLSearchParams();
  if (params?.query) queryParams.append("query", params.query);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.perPage) queryParams.append("perPage", params.perPage.toString());
  if (params?.tag) queryParams.append("tag", params.tag);

  const res = await fetch(`${API_BASE}/notes?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch notes");

  const data = await res.json();
  return data as { notes: Note[]; totalPages: number };
}

export async function fetchNoteById(id: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) throw new Error("Unauthorized: accessToken not found");

  const res = await fetch(`${API_BASE}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch note");

  const note = await res.json();
  return note as Note;
}

export interface NewNote {
  title: string;
  content: string;
  tags?: string[];
}

export async function createNote(newNote: NewNote) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) throw new Error("Unauthorized: accessToken not found");

  const res = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(newNote),
  });

  if (!res.ok) throw new Error("Failed to create note");

  const note = await res.json();
  return note as Note;
}

// -------------------- Auth / User --------------------

export async function checkSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    const res = await fetch(`${API_BASE}/auth/session`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (res.status === 401 && refreshToken) {
      // Пробуємо оновити токен
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        cache: "no-store",
      });

      if (!refreshRes.ok) return null;

      const data = await refreshRes.json();
      return data as { accessToken: string; user: User };
    }

    if (!res.ok) return null;

    const data = await res.json();
    return data as { accessToken: string; user: User };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await checkSession();
  return session?.user ?? null;
}

export async function updateUser(data: Partial<User>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) throw new Error("Unauthorized: accessToken not found");

  const res = await fetch(`${API_BASE}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update user");

  const user = await res.json();
  return user as User;
}
