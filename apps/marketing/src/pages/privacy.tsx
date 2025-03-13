import { MDXProvider } from "@mdx-js/react";
import Privacy from "../mdx/privacy.mdx";
export default function Page() {
  return (
    <MDXProvider>
      <div className="dark:prose-invert prose min-h-screen max-w-6xl mx-auto py-28 px-4">
        <Privacy />
      </div>
    </MDXProvider>
  );
}
