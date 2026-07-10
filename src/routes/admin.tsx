import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { ArrowLeft, ImagePlus, LogOut, Pencil, Plus, Save, Trash2, Upload } from "lucide-react";

import {
  adminLogin,
  listLanguages,
  updateLanguageContent,
  uploadLanguageMedia,
} from "@/lib/vatai.functions";
import type { LanguageContent } from "@/lib/languages";
import {
  DEFAULT_SHOWCASE,
  fileToDataUrl,
  loadShowcase,
  saveShowcase,
  type ShowcaseItem,
} from "@/lib/showcase";

const PW_KEY = "vatai_admin_pw";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "VAT-Ai Admin" },
      { name: "description", content: "Admin dashboard for VAT-Ai content." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(PW_KEY) : null;
    if (stored) setPassword(stored);
  }, []);

  return (
    <main className="relative min-h-screen">
      <Toaster theme="dark" richColors position="top-center" />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <span className="font-display text-sm tracking-widest text-neon">
            VAT-Ai · Admin
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!password ? (
            <LoginCard key="login" onSuccess={(pw) => { localStorage.setItem(PW_KEY, pw); setPassword(pw); }} />
          ) : (
            <Dashboard
              key="dash"
              password={password}
              onSignOut={() => { localStorage.removeItem(PW_KEY); setPassword(null); }}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* -------------------------------- Login -------------------------------- */

function LoginCard({ onSuccess }: { onSuccess: (pw: string) => void }) {
  const login = useServerFn(adminLogin);
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login({ data: { username, password: pw } });
      onSuccess(pw);
      toast.success("Welcome back");
    } catch {
      toast.error("Invalid username or password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mx-auto mt-16 max-w-md glass-panel rounded-2xl p-8"
    >
      <h1 className="font-display text-2xl">Admin Sign In</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Restricted area. Enter your credentials to manage content.
      </p>

      <label className="mt-6 block text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Username
      </label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-[oklch(0.82_0.2_195)]"
      />

      <label className="mt-4 block text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Password
      </label>
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        autoComplete="current-password"
        className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-[oklch(0.82_0.2_195)]"
      />

      <button disabled={busy} className="btn-neon mt-6 w-full">
        {busy ? "Signing in…" : "Sign In"}
      </button>
    </motion.form>
  );
}

/* ------------------------------- Dashboard ------------------------------- */

function Dashboard({ password, onSignOut }: { password: string; onSignOut: () => void }) {
  const qc = useQueryClient();
  const fetchAll = useServerFn(listLanguages);
  const { data: languages = [], isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: () => fetchAll(),
  });

  const [editing, setEditing] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Content Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage the headline, CTA, hero image and voice sample per language.
          </p>
        </div>
        <button
          onClick={onSignOut}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {(languages as LanguageContent[]).map((l) => (
            <div
              key={l.code}
              className="glass-panel flex flex-col gap-3 rounded-xl p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-lg neon-border font-display text-sm">
                  {String(l.sort_order).padStart(2, "0")}
                </div>
                <div>
                  <div className="font-display text-lg">
                    {l.native_name}{" "}
                    <span className="text-sm text-muted-foreground">/ {l.name}</span>
                  </div>
                  <div className="line-clamp-1 max-w-md text-xs text-muted-foreground">
                    {l.headline}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {l.image_url && (
                  <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    Image ✓
                  </span>
                )}
                {l.audio_url && (
                  <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    Audio ✓
                  </span>
                )}
                <button
                  onClick={() => setEditing(l.code)}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-[oklch(0.82_0.2_195)]"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <EditModal
            key={editing}
            password={password}
            language={(languages as LanguageContent[]).find((l) => l.code === editing)!}
            onClose={() => setEditing(null)}
            onSaved={() => qc.invalidateQueries({ queryKey: ["languages"] })}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------- Edit modal ------------------------------- */

function EditModal({
  password,
  language,
  onClose,
  onSaved,
}: {
  password: string;
  language: LanguageContent;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [headline, setHeadline] = useState(language.headline);
  const [buttonText, setButtonText] = useState(language.button_text);

  const update = useServerFn(updateLanguageContent);
  const upload = useServerFn(uploadLanguageMedia);

  const saveText = useMutation({
    mutationFn: () =>
      update({
        data: { password, code: language.code, headline, button_text: buttonText },
      }),
    onSuccess: () => {
      toast.success("Text updated");
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const uploadFile = async (kind: "image" | "audio", file: File) => {
    const buf = await file.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);
    await upload({
      data: {
        password,
        code: language.code,
        kind,
        filename: file.name,
        content_type: file.type || (kind === "image" ? "image/*" : "audio/*"),
        base64,
      },
    });
    toast.success(`${kind === "image" ? "Image" : "Audio"} uploaded`);
    onSaved();
  };

  const [uploading, setUploading] = useState<null | "image" | "audio">(null);
  const onFile = (kind: "image" | "audio") => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(kind);
    try {
      await uploadFile(kind, file);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel w-full max-w-lg rounded-2xl p-6"
      >
        <div className="mb-1 text-xs uppercase tracking-[0.3em] text-neon">
          {language.native_name} · {language.name}
        </div>
        <h2 className="font-display text-2xl">Edit content</h2>

        <label className="mt-6 block text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Headline
        </label>
        <textarea
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-[oklch(0.82_0.2_195)]"
        />

        <label className="mt-4 block text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Button text
        </label>
        <input
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-[oklch(0.82_0.2_195)]"
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <FileField
            label="Hero image"
            hint={language.image_url ? "Current image set" : "PNG/JPG"}
            accept="image/*"
            busy={uploading === "image"}
            onChange={onFile("image")}
          />
          <FileField
            label="Audio sample"
            hint={language.audio_url ? "Current audio set" : "MP3/WAV"}
            accept="audio/*"
            busy={uploading === "audio"}
            onChange={onFile("audio")}
          />
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
          <button
            onClick={() => saveText.mutate()}
            disabled={saveText.isPending}
            className="btn-neon inline-flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saveText.isPending ? "Saving…" : "Save text"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FileField({
  label,
  hint,
  accept,
  busy,
  onChange,
}: {
  label: string;
  hint: string;
  accept: string;
  busy: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex cursor-pointer flex-col rounded-xl border border-dashed border-white/15 bg-white/5 p-4 hover:border-[oklch(0.82_0.2_195)]">
      <div className="mb-1 flex items-center gap-2 text-sm">
        <Upload className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="text-xs text-muted-foreground">{busy ? "Uploading…" : hint}</div>
      <input type="file" accept={accept} onChange={onChange} className="hidden" disabled={busy} />
    </label>
  );
}
