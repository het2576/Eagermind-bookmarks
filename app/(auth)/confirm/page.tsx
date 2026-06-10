import Link from "next/link";
import ResendConfirmationForm from "@/components/auth/ResendConfirmationForm";

export default function ConfirmPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-900 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">Check your email</h1>
        <p className="text-gray-600">
          Check your email — we sent you a confirmation link. Click it to activate
          your account.
        </p>

        <ResendConfirmationForm />

        <Link
          href="/login"
          className="mt-6 inline-block font-medium text-blue-600 hover:underline"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}
