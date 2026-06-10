import LoginForm from "@/components/auth/LoginForm";

const ERROR_MESSAGES: Record<string, string> = {
  confirmation_failed:
    "Email confirmation failed. Please sign up again or request a new link.",
  link_expired:
    "That confirmation link has expired. Please sign up again to receive a new email.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const urlError = params.error ? ERROR_MESSAGES[params.error] : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-gray-900 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
          Log in
        </h1>
        <LoginForm urlError={urlError} />
      </div>
    </main>
  );
}
