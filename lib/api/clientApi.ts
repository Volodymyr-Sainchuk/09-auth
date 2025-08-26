"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/types/note";
import axios from "axios";
import type { User } from "@/types/user";
import { getCookie } from "cookies-next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export type NewNote = Omit<Note, "id" | "createdAt" | "updatedAt">;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  },
});

export interface RegisterPayload {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterPayload): Promise<User> {
  const res = await axios.post<User>(`${API_BASE}/api/auth/register`, data, {
    withCredentials: true,
  });
  return res.data;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser(data: LoginPayload): Promise<User> {
  const res = await axios.post<User>(`${API_BASE}/api/auth/login`, data, {
    withCredentials: true,
  });
  return res.data;
}

export async function getSession(): Promise<User | null> {
  try {
    const res = await axios.get<User>(`${API_BASE}/api/auth/session`, {
      withCredentials: true,
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export interface UpdateUserPayload {
  username?: string;
  avatar?: string;
}

export async function updateUser(data: UpdateUserPayload): Promise<User> {
  const res = await axios.patch<User>(`${API_BASE}/api/users/me`, data, {
    withCredentials: true,
  });
  return res.data;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await axios.get<User>(`${API_BASE}/api/auth/session`, {
      withCredentials: true,
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

// -------------------- Notes API --------------------

export async function createNote(note: NewNote): Promise<Note> {
  const token = getCookie("token"); // беремо токен з cookie
  if (!token) throw new Error("Unauthorized: token not found");

  const res = await axios.post<Note>(`${API_BASE}/api/notes`, note, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export async function fetchNotes(params: {
  query?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}): Promise<FetchNotesResponse> {
  const { query = "", page = 1, perPage = 10, tag } = params;

  const res = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params: {
      ...(query.trim() ? { search: query.trim() } : {}),
      ...(tag ? { tag } : {}),
      page,
      perPage,
    },
  });

  return res.data;
}

export async function fetchNotesServer(params?: {
  query?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}): Promise<FetchNotesResponse> {
  const { query = "", page = 1, perPage = 10, tag } = params ?? {};
  const res = await axios.get<FetchNotesResponse>(`${API_BASE}/api/notes`, { params: { query, page, perPage, tag } });
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await axiosInstance.delete<Note>(`/notes/${id}`);
  return res.data;
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation<Note, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axiosInstance.get<Note>(`/${id}`);
  return response.data;
}
