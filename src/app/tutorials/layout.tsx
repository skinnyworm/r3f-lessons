import { ReactNode } from "react";
import json from "three/examples/fonts/helvetiker_regular.typeface.json";

export default function TutorialLayout({ children }: { children: ReactNode }) {
  return (
    <main className="container mx-auto px-4 pb-16">
      <article className="prose lg:prose-xl max-w-none">{children}</article>
    </main>
  );
}
