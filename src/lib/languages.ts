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

export const WHATSAPP_MESSAGES: Record<LanguageCode, string> = {
  en: "Hi VAT-AI, I want to book an AI Call Demo.",
  te: "హాయ్ VAT-AI, నేను AI కాల్ డెమో బుక్ చేయాలనుకుంటున్నాను.",
  hi: "नमस्ते VAT-AI, मैं एक AI कॉल डेमो बुक करना चाहता हूँ।",
  ta: "வணக்கம் VAT-AI, நான் ஒரு AI கால் டெமோவை பதிவு செய்ய விரும்புகிறேன்.",
  kn: "ನಮಸ್ಕಾರ VAT-AI, ನಾನು AI ಕಾಲ್ ಡೆಮೊ ಬುಕ್ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ.",
  ml: "ഹായ് VAT-AI, എനിക്ക് ഒരു AI കോൾ ഡെമോ ബുക്ക് ചെയ്യണം.",
  bn: "হাই VAT-AI, আমি একটি AI কল ডেমো বুক করতে চাই।",
  mr: "नमस्कार VAT-AI, मला एक AI कॉल डेमो बुक करायचा आहे.",
  gu: "હાય VAT-AI, હું એક AI કૉલ ડેમો બુક કરવા માંગુ છું.",
  pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ VAT-AI, ਮੈਂ ਇੱਕ AI ਕਾਲ ਡੈਮੋ ਬੁੱਕ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
};

