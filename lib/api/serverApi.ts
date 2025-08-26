// serverApi.ts
import { Note } from "@/types/note";
import axios from "axios";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchNotesServer(
  params?: { query?: string; page?: number; perPage?: number; tag?: string },
  token?: string
): Promise<FetchNotesResponse> {
  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await axios.get<FetchNotesResponse>(`${API_BASE}/api/notes`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}
