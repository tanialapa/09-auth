"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import type { NoteTag } from "../../types/note";
import { createNote } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useNoteStore } from "@/lib/store/noteStore";

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.push("/notes/filter/all");
    },
  });

  async function formAction(formData: FormData) {
    const title = formData.get("title");
    const content = formData.get("content");
    const tag = formData.get("tag");

    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      typeof tag !== "string"
    ) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle.length < 3 || trimmedTitle.length > 50) {
      return;
    }

    if (trimmedContent.length > 500) {
      return;
    }

    await createNoteMutation.mutateAsync({
      title: trimmedTitle,
      content: trimmedContent,
      tag: tag as NoteTag,
    });
  }

  return (
    <form className={css.form} action={formAction}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          minLength={3}
          maxLength={50}
          required
          defaultValue={draft.title}
          onChange={(e) =>
            setDraft({
              title: e.target.value,
            })
          }
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          required
          defaultValue={draft.content}
          onChange={(e) =>
            setDraft({
              content: e.target.value,
            })
          }
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={(e) =>
            setDraft({
              tag: e.target.value as NoteTag,
            })
          }
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {/* <ErrorMessage name="tag" component="span" className={css.error} /> */}
      </div>

      {createNoteMutation.isError && (
        <p className={css.error}>Failed to create note.</p>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createNoteMutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
