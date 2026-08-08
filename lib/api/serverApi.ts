import { cookies } from "next/headers";
import type {
  FetchNotesParams,
  FetchNotesResponse,
  Note,
} from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const { tag, ...restParams } = params;
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      ...restParams,
      ...(tag && tag !== "all" ? { tag } : {}),
    },
    headers: { Cookie: await getCookieHeader() },
  });
  return response.data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${noteId}`, {
    headers: { Cookie: await getCookieHeader() },
  });
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me", {
    headers: { Cookie: await getCookieHeader() },
  });
  return response.data;
}

export async function checkSession(cookieHeader?: string): Promise<boolean> {
  const response = await api.get<{ success: boolean }>("/auth/session", {
    headers: { Cookie: cookieHeader ?? (await getCookieHeader()) },
  });
  return response.data.success;
}
