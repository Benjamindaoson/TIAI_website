interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstileToken(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return process.env.NODE_ENV === "production"
      ? { success: false, error: "Turnstile is not configured" }
      : { success: true };
  }

  if (!token) {
    return { success: false, error: "Missing Turnstile token" };
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (remoteIp) formData.append("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return { success: false, error: "Turnstile verification failed" };
  }

  const result = (await response.json()) as TurnstileResponse;
  return result.success
    ? { success: true }
    : { success: false, error: result["error-codes"]?.join(", ") || "Invalid Turnstile token" };
}
