import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { FALLBACK_LANGUAGES } from "./languages";

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
  try {
    if (!process.env.SUPABASE_URL) {
      return FALLBACK_LANGUAGES;
    }
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("languages")
      .select("code,name,native_name,sort_order,headline,button_text,image_url,audio_url")
      .order("sort_order", { ascending: true });
    
    if (error || !data || data.length === 0) {
      return FALLBACK_LANGUAGES;
    }
    return data;
  } catch (err) {
    return FALLBACK_LANGUAGES;
  }
});

/** Public: fetch one language's content. */
export const getLanguage = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ code: z.string().min(2).max(4) }).parse(d))
  .handler(async ({ data }) => {
    try {
      if (!process.env.SUPABASE_URL) {
        return FALLBACK_LANGUAGES.find((l) => l.code === data.code) || null;
      }
      const supabase = publicClient();
      const { data: row, error } = await supabase
        .from("languages")
        .select("code,name,native_name,sort_order,headline,button_text,image_url,audio_url")
        .eq("code", data.code)
        .maybeSingle();
        
      if (error || !row) {
        return FALLBACK_LANGUAGES.find((l) => l.code === data.code) || null;
      }
      return row;
    } catch (err) {
      return FALLBACK_LANGUAGES.find((l) => l.code === data.code) || null;
    }
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

/** Public: list all showcase items, ordered by sort_order. */
export const listShowcase = createServerFn({ method: "GET" }).handler(async () => {
  try {
    if (!process.env.SUPABASE_URL) {
      return [];
    }
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("showcase_items")
      .select("id,title,description,media_url,media_type,sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
});

/** Admin: upsert a showcase item (title, description, sort_order). */
export const upsertShowcaseItem = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        password: z.string(),
        id: z.string().min(1).max(100),
        title: z.string().min(1).max(300),
        description: z.string().max(1000),
        sort_order: z.number().int().min(0),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASS) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("showcase_items")
      .upsert(
        {
          id: data.id,
          title: data.title,
          description: data.description,
          sort_order: data.sort_order,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Admin: delete a showcase item. */
export const deleteShowcaseItem = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ password: z.string(), id: z.string().min(1).max(100) }).parse(d),
  )
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASS) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("showcase_items")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Admin: upload a showcase item's media file (base64) and return a signed URL. */
export const uploadShowcaseMedia = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        password: z.string(),
        id: z.string().min(1).max(100),
        filename: z.string().min(1).max(200),
        content_type: z.string().min(1).max(120),
        base64: z.string().min(1),
        media_type: z.enum(["image", "video"]).default("image"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASS) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `showcase/${data.id}/${Date.now()}-${safeName}`;

    const { error: upErr } = await supabaseAdmin.storage
      .from("vatai-media")
      .upload(path, bytes, { contentType: data.content_type, upsert: true });
    if (upErr) throw new Error(upErr.message);

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("vatai-media")
      .createSignedUrl(path, SIGNED_URL_TTL);
    if (signErr || !signed) throw new Error(signErr?.message ?? "sign failed");

    // Persist the media URL in the database so it's available on every device
    const { error: updErr } = await supabaseAdmin
      .from("showcase_items")
      .update({
        media_url: signed.signedUrl,
        media_type: data.media_type,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (updErr) throw new Error(updErr.message);

    return { ok: true, url: signed.signedUrl };
  });

/** Admin: register a language media file uploaded directly to storage by client (generates signed URL + saves to DB). */
export const registerLanguageMedia = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        password: z.string(),
        code: z.string().min(2).max(4),
        kind: z.enum(["image", "audio"]),
        path: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASS) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("vatai-media")
      .createSignedUrl(data.path, SIGNED_URL_TTL);
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

/** Admin: register a showcase media file uploaded directly to storage by client (generates signed URL + saves to DB). */
export const registerShowcaseMedia = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        password: z.string(),
        id: z.string().min(1).max(100),
        path: z.string().min(1),
        media_type: z.enum(["image", "video"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASS) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("vatai-media")
      .createSignedUrl(data.path, SIGNED_URL_TTL);
    if (signErr || !signed) throw new Error(signErr?.message ?? "sign failed");

    const { error: updErr } = await supabaseAdmin
      .from("showcase_items")
      .update({
        media_url: signed.signedUrl,
        media_type: data.media_type,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (updErr) throw new Error(updErr.message);

    return { ok: true, url: signed.signedUrl };
  });


