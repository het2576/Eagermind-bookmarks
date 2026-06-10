export function welcomeEmailHtml(handle: string, confirmUrl?: string): string {
  const confirmButton = confirmUrl
    ? `<a href="${confirmUrl}" style="display:inline-block;margin-top:24px;padding:14px 28px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;">
        Confirm your email
      </a>
      <p style="margin:16px 0 0;font-size:13px;line-height:1.5;color:#6b7280;">
        If the button does not work, copy and paste this link into your browser:<br />
        <a href="${confirmUrl}" style="color:#2563eb;word-break:break-all;">${confirmUrl}</a>
      </p>`
    : `<p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#6b7280;">
        Please check your inbox for a separate confirmation email from Supabase to activate your account.
      </p>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Welcome to Bookmarks, @${handle}</title>
  </head>
  <body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;background:#f9fafb;color:#111827;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:32px;">
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#111827;">Welcome to Bookmarks, @${handle}</h1>
      <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">
        Your account is set up. Your public profile will be live at /${handle} once you confirm your email.
      </p>
      ${confirmButton}
    </div>
  </body>
</html>`;
}
