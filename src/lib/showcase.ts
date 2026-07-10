export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
}

const KEY = "vatai_showcase_items";

export const DEFAULT_SHOWCASE: ShowcaseItem[] = [
  {
    id: "crm",
    title: "CRM Triggers",
    description:
      "Fire an AI call the moment a new lead lands in your CRM — HubSpot, Salesforce, Zoho, or custom.",
    mediaUrl: "",
    mediaType: "image",
  },
  {
    id: "web",
    title: "Web Actions",
    description:
      "Form fill, checkout abandonment, or a button click can instantly spin up a personalised AI call.",
    mediaUrl: "",
    mediaType: "image",
  },
  {
    id: "whatsapp",
    title: "Messaging Apps",
    description:
      "Escalate a WhatsApp or SMS conversation into a live AI voice call in the customer's language.",
    mediaUrl: "",
    mediaType: "image",
  },
  {
    id: "calendar",
    title: "Calendar & Bookings",
    description:
      "Auto-confirm, reschedule and follow up appointments without a human ever picking up the phone.",
    mediaUrl: "",
    mediaType: "image",
  },
];

export function loadShowcase(): ShowcaseItem[] {
  if (typeof window === "undefined") return DEFAULT_SHOWCASE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SHOWCASE;
    const parsed = JSON.parse(raw) as ShowcaseItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_SHOWCASE;
    return parsed;
  } catch {
    return DEFAULT_SHOWCASE;
  }
}

export function saveShowcase(items: ShowcaseItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("vatai:showcase-updated"));
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Booking WhatsApp — update the phone number below to your business number.
export const BOOKING_WHATSAPP_NUMBER = "918500416456"; // TODO: replace with your number
export const BOOKING_WHATSAPP_MESSAGE =
  "Hi VAT-AI team! I visited your website and want to set up a live AI Voice Agent demo for my business.";
export const BOOKING_WHATSAPP_URL = `https://wa.me/${BOOKING_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  BOOKING_WHATSAPP_MESSAGE,
)}`;
