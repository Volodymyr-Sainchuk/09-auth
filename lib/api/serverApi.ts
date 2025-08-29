"use server";

import { cookies } from "next/headers";
import { api } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api`;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  query?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

export interface NewNote {
  title: string;
  content: string;
  tags?: string[];
}

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export async function fetchNotes(params?: FetchNotesParams) {
  const cookieHeader = await getCookieHeader();

  const res = await api.get<FetchNotesResponse>(`${API_BASE}/notes`, {
    params,
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}

export async function fetchNoteById(id: string) {
  const cookieHeader = await getCookieHeader();

  const res = await api.get<Note>(`${API_BASE}/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}

export async function createNote(newNote: NewNote) {
  const cookieHeader = await getCookieHeader();

  const res = await api.post<Note>(`${API_BASE}/notes`, newNote, {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}

export async function checkSession(accessToken?: string, refreshToken?: string) {
  if (!accessToken && !refreshToken) return { valid: false };

  try {
    const res = await api.get("/auth/session", {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "x-refresh-token": refreshToken ?? "",
      },
    });

    return {
      valid: true,
      data: res.data,
      setCookie: res.headers["set-cookie"],
    };
  } catch {
    return { valid: false };
  }
}

export async function getCurrentUser() {
  const cookieHeader = await getCookieHeader();

  try {
    const res = await api.get<User>(`${API_BASE}/users/me`, {
      headers: { Cookie: cookieHeader },
    });

    return res.data;
  } catch {
    return null;
  }
}

export async function updateUser(data: Partial<User>) {
  const cookieHeader = await getCookieHeader();

  const res = await api.patch<User>(`${API_BASE}/users/me`, data, {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}
