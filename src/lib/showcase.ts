export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  media_url: string;
  media_type: "image" | "video";
  sort_order: number;
}

export const DEFAULT_SHOWCASE: ShowcaseItem[] = [
  {
    id: "crm",
    title: "CRM Triggers",
    description:
      "Fire an AI call the moment a new lead lands in your CRM — HubSpot, Salesforce, Zoho, or custom.",
    media_url: "",
    media_type: "image",
    sort_order: 1,
  },
  {
    id: "web",
    title: "Web Actions",
    description:
      "Form fill, checkout abandonment, or a button click can instantly spin up a personalised AI call.",
    media_url: "",
    media_type: "image",
    sort_order: 2,
  },
  {
    id: "whatsapp",
    title: "Messaging Apps",
    description:
      "Escalate a WhatsApp or SMS conversation into a live AI voice call in the customer's language.",
    media_url: "",
    media_type: "image",
    sort_order: 3,
  },
  {
    id: "calendar",
    title: "Calendar & Bookings",
    description:
      "Auto-confirm, reschedule and follow up appointments without a human ever picking up the phone.",
    media_url: "",
    media_type: "image",
    sort_order: 4,
  },
];

// Booking WhatsApp — update the phone number below to your business number.
export const BOOKING_WHATSAPP_NUMBER = "918500416456"; // TODO: replace with your number
export const BOOKING_WHATSAPP_MESSAGE =
  "Hi VYAt-AI team! I visited your website and want to set up a live AI Voice Agent demo for my business.";
export const BOOKING_WHATSAPP_URL = `https://wa.me/${BOOKING_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  BOOKING_WHATSAPP_MESSAGE,
)}`;
