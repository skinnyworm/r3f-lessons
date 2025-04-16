export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-svh">
      <main className="container mx-auto px-4">
        <article className="prose lg:prose-xl max-w-none">{children}</article>
      </main>
    </div>
  );
}
