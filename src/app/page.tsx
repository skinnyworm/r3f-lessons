import Link from "next/link";

const examples = [
  {
    title: "Gallery",
    description: "A simple gallery example.",
    href: "/examples/gallery",
  },
  {
    title: "Minecraft",
    description: "A Minecraft-themed example.",
    href: "/examples/minecraft",
  },
  {
    title: "Nike",
    description: "A glossy glass.",
    href: "/examples/nike",
  },
  {
    title: "Porsche",
    description: "Env map example.",
    href: "/examples/env-map",
  },
  {
    title: "Arkanoid",
    description: "Simple Arkanoid game.",
    href: "/examples/arkanoid",
  },
  {
    title: "Pinball",
    description: "Simple Pinball game.",
    href: "/examples/pinball",
  },
];

const tutorials = [
  {
    title: "09 Shadow",
    description: "Abount Shadow",
    href: "/tutorials/09-shadow",
  },
  {
    title: "10 Loading Model",
    description: "Loading Models",
    href: "/tutorials/10-loading-model",
  },
  {
    title: "11 Text",
    description: "Text",
    href: "/tutorials/11-text",
  },
];

export default function Home() {
  return (
    <div>
      <main className="container mx-auto p4 mt-10">
        <article>
          <h2 className="text-2xl font-semibold my-4">Tutorial</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {tutorials.map((tutorial) => (
              <li key={tutorial.title}>
                <Link href={tutorial.href} className="block border p-2 rounded-md hover:bg-gray-100">
                  <h3 className="text-lg font-bold">{tutorial.title}</h3>
                  <p>{tutorial.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="text-2xl font-semibold my-4">Examples</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {examples.map((example) => (
              <li key={example.title}>
                <Link href={example.href} className="block border p-2 rounded-md hover:bg-gray-100">
                  <h3 className="text-lg font-bold">{example.title}</h3>
                  <p>{example.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </main>
    </div>
  );
}
