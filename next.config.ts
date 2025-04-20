import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import langJs from "highlight.js/lib/languages/javascript";
import langTsx from "highlight.js/lib/languages/typescript";

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeHighlight, { languages: { javascript: langJs, tsx: langTsx } }]],
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default withMDX(nextConfig);
