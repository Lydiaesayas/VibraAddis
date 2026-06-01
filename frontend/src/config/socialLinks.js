/** Update these URLs with VibraAddis official social profiles */
import {
  Camera,
  Music,
  Send,
  BadgeInfo,
} from "lucide-react";

const socialIcons = {
  instagram: Camera,
  tiktok: Music,
  telegram: Send,
  facebook: BadgeInfo,
};

export { socialIcons };

export const VIBRA_ADDIS_SOCIAL = {
  instagram: {
    label: "Instagram",
    url: "https://www.instagram.com/vibraaddis",
    icon: "instagram",
  },

  tiktok: {
    label: "TikTok",
    url: "https://www.tiktok.com/@vibraaddis",
    icon: "tiktok",
  },

  telegram: {
    label: "Telegram",
    url: "https://t.me/vibraaddis",
    icon: "telegram",
  },

  facebook: {
    label: "Facebook",
    url: "https://www.facebook.com/vibraaddis",
    icon: "facebook",
  },
};
