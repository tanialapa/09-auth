"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "../sign-up/SignUpPage.module.css";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      setError("Please enter a valid email and password.");
      setIsSubmitting(false);
      return;
    }

    try {
      const user = await login({ email, password });
      setUser(user);
      router.push("/profile");
    } catch (requestError) {
      if (isAxiosError<{ error?: string }>(requestError)) {
        setError(requestError.response?.data.error ?? "Login failed.");
      } else {
        setError("Login failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign in</h1>
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
          >
            Log in
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}
