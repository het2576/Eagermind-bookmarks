import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-gray-900 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
          Create your account
        </h1>
        <SignupForm />
      </div>
    </main>
  );
}
