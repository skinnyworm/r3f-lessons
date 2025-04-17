import { ReactNode } from "react";

export default function TutorialLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <article className="prose lg:prose-xl">
        <div className="container mx-auto px-4">{children}</div>
      </article>
    </main>
  );
}
