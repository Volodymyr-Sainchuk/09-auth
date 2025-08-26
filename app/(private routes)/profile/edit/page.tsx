"use client";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Додаємо токен з cookies у кожен запит
axiosInstance.interceptors.request.use((config) => {
  const token = getCookie("token") as string | undefined;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================== AUTH ==================

export interface RegisterPayload {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterPayload): Promise<User> {
  const res = await axiosInstance.post<User>("/auth/register", data);
  return res.data;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser(data: LoginPayload): Promise<User> {
  const res = await axiosInstance.post<User>("/auth/login", data);
  return res.data;
}

export async function getSession(): Promise<User | null> {
  try {
    const res = await axiosInstance.get<User>("/auth/session");
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
  const res = await axiosInstance.patch<User>("/users/me", data);
  return res.data;
}

// ================== NOTES ==================

export type NewNote = Omit<Note, "id" | "createdAt" | "updatedAt">;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function createNote(note: NewNote): Promise<Note> {
  const res = await axiosInstance.post<Note>("/notes", note);
  return res.data;
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export async function fetchNotes(params?: {
  query?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}): Promise<FetchNotesResponse> {
  const { query = "", page = 1, perPage = 10, tag } = params ?? {};
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

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await axiosInstance.get<Note>(`/notes/${id}`);
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
