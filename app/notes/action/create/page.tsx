import { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

export const metadata: Metadata = {
  title: "NoteHub",
  description: " Create new note",
  openGraph: {
    title: "NoteHub",
    description: "Create new note",
    url: "https://notehub.com/notes/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1000,
        height: 600,
        alt: "NoteHub",
      },
    ],
    type: "website",
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
