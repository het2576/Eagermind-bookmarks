import { createAdminClient } from "@/lib/supabase/admin";

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function findUserByEmail(email: string) {
  const admin = createAdminClient();
  let page = 1;

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });

    if (error || !data.users.length) {
      return null;
    }

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );

    if (match) {
      return match;
    }

    if (data.users.length < 200) {
      break;
    }

    page++;
  }

  return null;
}

export async function deleteUserByEmail(email: string) {
  const admin = createAdminClient();
  const user = await findUserByEmail(email);

  if (!user) {
    return { deleted: false, reason: "not_found" as const };
  }

  await admin.from("profiles").delete().eq("id", user.id);
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    throw error;
  }

  return { deleted: true, userId: user.id };
}

export async function buildConfirmationUrl(email: string, password: string) {
  const admin = createAdminClient();
  const appUrl = getAppUrl();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      redirectTo: `${appUrl}/api/auth/confirm`,
    },
  });

  if (error) {
    console.error("confirmation link error:", error);
    return undefined;
  }

  const hashedToken = data.properties?.hashed_token;
  const verificationType = data.properties?.verification_type ?? "signup";

  if (!hashedToken) {
    return data.properties?.action_link;
  }

  const params = new URLSearchParams({
    token_hash: hashedToken,
    type: verificationType,
  });

  return `${appUrl}/api/auth/confirm?${params.toString()}`;
}

export async function getProfileByUserId(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("handle")
    .eq("id", userId)
    .maybeSingle();

  return data;
}
