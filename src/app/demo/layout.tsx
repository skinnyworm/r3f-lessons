export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full h-svh bg-black">{children}</div>;
}
