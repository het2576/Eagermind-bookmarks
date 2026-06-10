import { resend } from "@/lib/resend/client";
import { welcomeEmailHtml } from "@/lib/resend/templates/welcome";
import { buildConfirmationUrl } from "@/lib/auth/users";

function getResendFromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL ??
    "Bookmarks <noreply@bookmarks.driftlessx.dev>"
  );
}

/** Sends welcome + confirmation email via Resend (verified domain required). */
export async function sendSignupEmail({
  email,
  handle,
  password,
}: {
  email: string;
  handle: string;
  password: string;
}) {
  const confirmUrl = await buildConfirmationUrl(email, password);

  if (!confirmUrl) {
    return { error: new Error("Could not generate confirmation link") };
  }

  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: email,
    subject: `Welcome to Bookmarks, @${handle}`,
    html: welcomeEmailHtml(handle, confirmUrl),
  });

  return { error: error ?? null };
}
