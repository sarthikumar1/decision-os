import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
      <div className="text-center max-w-md px-6">
        <div className="h-12 w-12 rounded-lg bg-blue-600 mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-xl font-bold">?</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you&apos;re looking for doesn&apos;t exist. Decision OS is a single-page app —
          all the action happens on the home page.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Go to Decision OS
        </Link>
      </div>
    </div>
  );
}
