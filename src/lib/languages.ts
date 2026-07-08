export type LanguageCode =
  | "te" | "hi" | "en" | "ta" | "kn" | "ml" | "bn" | "mr" | "gu" | "pa";

export interface LanguageContent {
  code: LanguageCode;
  name: string;
  native_name: string;
  sort_order: number;
  headline: string;
  button_text: string;
  image_url: string | null;
  audio_url: string | null;
}

export const WHATSAPP_NUMBER = "918500416456";
