import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  confirmation_failed: "Email confirmation failed. Please sign up again or request a new link.",
  link_expired: "That confirmation link has expired. Please sign up again to receive a new email.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-gray-900 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">Log in</h1>

        {errorMessage && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
          Login form coming in the next task.{" "}
          <Link href="/signup" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
