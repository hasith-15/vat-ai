import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// Hardcoded admin credentials per product spec. NOTE: anyone who calls these
// server functions with the correct password can update content — this matches
// the requested UX but is not enterprise-grade auth.
const ADMIN_USER = "hasith_15";
const ADMIN_PASS = "Xyz123321@@";

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // 10 years

function publicClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

/** Public: list all languages, ordered. */
export const listLanguages = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("languages")
    .select("code,name,native_name,sort_order,headline,button_text,image_url,audio_url")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

/** Public: fetch one language's content. */
export const getLanguage = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ code: z.string().min(2).max(4) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("languages")
      .select("code,name,native_name,sort_order,headline,button_text,image_url,audio_url")
      .eq("code", data.code)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

/** Admin: verify credentials (used by the login screen). */
export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ username: z.string(), password: z.string() }).parse(d),
  )
  .handler(async ({ data }) => {
    const ok = data.username === ADMIN_USER && data.password === ADMIN_PASS;
    return { ok };
  });


/** Admin: update text content for a language. */
export const updateLanguageContent = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        password: z.string(),
        code: z.string().min(2).max(4),
        headline: z.string().min(1).max(500),
        button_text: z.string().min(1).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASS) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("languages")
      .update({
        headline: data.headline,
        button_text: data.button_text,
        updated_at: new Date().toISOString(),
      })
      .eq("code", data.code);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Admin: upload an image OR audio file (base64) and save a signed URL on the row. */
export const uploadLanguageMedia = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        password: z.string(),
        code: z.string().min(2).max(4),
        kind: z.enum(["image", "audio"]),
        filename: z.string().min(1).max(200),
        content_type: z.string().min(1).max(120),
        base64: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASS) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${data.kind}/${data.code}/${Date.now()}-${safeName}`;

    const { error: upErr } = await supabaseAdmin.storage
      .from("vatai-media")
      .upload(path, bytes, { contentType: data.content_type, upsert: true });
    if (upErr) throw new Error(upErr.message);

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("vatai-media")
      .createSignedUrl(path, SIGNED_URL_TTL);
    if (signErr || !signed) throw new Error(signErr?.message ?? "sign failed");

    const column = data.kind === "image" ? "image_url" : "audio_url";
    const patch: Record<string, string> = { updated_at: new Date().toISOString() };
    patch[column] = signed.signedUrl;
    const { error: updErr } = await supabaseAdmin
      .from("languages")
      .update(patch as never)
      .eq("code", data.code);
    if (updErr) throw new Error(updErr.message);

    return { ok: true, url: signed.signedUrl };
  });
