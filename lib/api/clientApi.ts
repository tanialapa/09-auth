import type {
  CreateNoteData,
  FetchNotesParams,
  FetchNotesResponse,
  Note,
} from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";

interface AuthCredentials {
  email: string;
  password: string;
}

interface UpdateUserData {
  username: string;
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
  });
  return response.data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${noteId}`);
  return response.data;
}

export async function createNote(noteData: CreateNoteData): Promise<Note> {
  const response = await api.post<Note>("/notes", noteData);
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${noteId}`);
  return response.data;
}

export async function register(credentials: AuthCredentials): Promise<User> {
  const response = await api.post<User>("/auth/register", credentials);
  return response.data;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const response = await api.post<User>("/auth/login", credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<boolean> {
  const response = await api.get<{ success: boolean }>("/auth/session");
  return response.data.success;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function updateMe(userData: UpdateUserData): Promise<User> {
  const response = await api.patch<User>("/users/me", userData);
  return response.data;
}
