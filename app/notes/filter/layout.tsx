import type { ReactNode } from "react";


import css from "./LayoutNotes.module.css";


interface FilterLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function RootLayout({
  children,
  sidebar, // Add the sidebar prop here
}: Readonly<FilterLayoutProps>) {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
}
