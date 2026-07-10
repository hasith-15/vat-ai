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

export const FALLBACK_LANGUAGES: LanguageContent[] = [
  { code: "te", name: "Telugu", native_name: "తెలుగు", sort_order: 1, headline: "మీ వ్యాపారం కోసం బహుభాషా AI వాయిస్ ఏజెంట్లు", button_text: "డెమో బుక్ చేయండి", image_url: null, audio_url: null },
  { code: "hi", name: "Hindi", native_name: "हिन्दी", sort_order: 2, headline: "आपके व्यवसाय के लिए बहुभाषी AI वॉयस एजेंट", button_text: "डेमो बुक करें", image_url: null, audio_url: null },
  { code: "en", name: "English", native_name: "English", sort_order: 3, headline: "Multilingual AI Voice Agents for your business", button_text: "Book a Demo", image_url: null, audio_url: null },
  { code: "ta", name: "Tamil", native_name: "தமிழ்", sort_order: 4, headline: "உங்கள் வணிகத்திற்கான AI குரல் முகவர்கள்", button_text: "டெமோவை பதிவு செய்யவும்", image_url: null, audio_url: null },
  { code: "kn", name: "Kannada", native_name: "ಕನ್ನಡ", sort_order: 5, headline: "ನಿಮ್ಮ ವ್ಯಾಪಾರಕ್ಕಾಗಿ AI ಧ್ವನಿ ಏಜೆಂಟ್‌ಗಳು", button_text: "ಡೆಮೊ ಬುಕ್ ಮಾಡಿ", image_url: null, audio_url: null },
  { code: "ml", name: "Malayalam", native_name: "മലയാളം", sort_order: 6, headline: "നിങ്ങളുടെ ബിസിനസ്സിനായി AI വോയ്‌സ് ഏജന്റുമാർ", button_text: "ഡെമോ ബുക്ക് ചെയ്യുക", image_url: null, audio_url: null },
  { code: "bn", name: "Bengali", native_name: "বাংলা", sort_order: 7, headline: "আপনার ব্যবসার জন্য AI ভয়েস এজেন্ট", button_text: "ডেমো বুক করুন", image_url: null, audio_url: null },
  { code: "mr", name: "Marathi", native_name: "मराठी", sort_order: 8, headline: "तुमच्या व्यवसायासाठी AI व्हॉइस एजंट", button_text: "डेमो बुक करा", image_url: null, audio_url: null },
  { code: "gu", name: "Gujarati", native_name: "ગુજરાતી", sort_order: 9, headline: "તમારા વ્યવસાય માટે AI વૉઇસ એજન્ટ્સ", button_text: "ડેમો બુક કરો", image_url: null, audio_url: null },
  { code: "pa", name: "Punjabi", native_name: "ਪੰਜਾਬੀ", sort_order: 10, headline: "ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ ਲਈ AI ਵੌਇਸ ਏਜੰਟ", button_text: "ਡੈਮੋ ਬੁੱਕ ਕਰੋ", image_url: null, audio_url: null },
];
