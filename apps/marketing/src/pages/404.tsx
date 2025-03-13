import Link from "next/link";
export default function Example() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <main className="flex-grow mx-auto max-w-7xl w-full flex flex-col px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex-shrink-0 my-auto py-16 sm:py-32">
          <p className="text-sm font-semibold  uppercase tracking-wide text-blue-500">
            404 error
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl dark:text-zinc-50">
            Page not found
          </h1>
          <p className="mt-2 text-base text-gray-500 dark:text-zinc-400">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-6">
            <Link href="/">
              <a className="text-base font-medium text-blue-600">
                Go back home<span aria-hidden="true"> &rarr;</span>
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
