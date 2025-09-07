import { AuthRouteConfig } from "./routes";
import { testimonial1, testimonial2, testimonial3, watch, watch2, watch3, watch4, watch5, watch6, watch7, watch8 } from "@/assets/images";

export const Roles = {
  admin: "official",
  staff: "staff",
};

export const LOCAL_STORAGE_VALUES = {
  RE_OLD_USER: "rEOldUser",
};
export const cookieValues = {
  token: `re-token`,
  userType: `re-userType`,
  enrollmentRole: "enrollment",
};

export const sidebarModuleMenus = [
  {
    path: "/dashboard",
    text: "Dashboard",
    hasTabs: false,
  },
  {
    path: "/tickets",
    text: "Tickets",
    menuValue: "TicketManagement",
    hasTabs: false,
  },
  {
    path: "/staff-management/staffList",
    text: "Staff Management",
    menuValue: "StaffManagement",
    hasTabs: true,
  },
  {
    path: "/analytics",
    text: "Reports & Analytics",
    menuValue: "Analytics",
    hasTabs: true,
  },
];

export enum PAGE_SIZE {
  xs = 5,
  sm = 15,
  md = 20,
  lg = 25,
  xl = 30,
}

export enum SEARCH_DELAY {
  sm = 500,
  md = 1000,
  lg = 1500,
  xl = 2000,
}

export const CURRENT_YEAR = 2025;

export const FILE_SIZE = 1;

export const MENU_ITEMS = [
  { title: "HOME", path: AuthRouteConfig.HOME },
  { title: "SHOP", path: AuthRouteConfig.SHOP },
  { title: "ABOUT US", path: AuthRouteConfig.ABOUT },
];

export const CONTACT_ITEMS = [
  {
    title: "TELEPHONE",
    value: "090-123-4567-0",
    link: "tel:09012345670",
  },
  {
    title: "EMAIL",
    value: "support@edenwoodwatchhub.com",
    link: "mailto:support@edenwoodwatchhub.com",
  },
];


export const LANDING_FEATURED_PRODUCTS = [
  { id: "1", price: 450, name: "Eden Chrono Elite", category: "watches", image: watch },
  { id: "2", price: 620, name: "Regal Heritage Automatic", category: "watches", image: watch2 },
  { id: "3", price: 750, name: "Timeless Gold Royale", category: "watches", image: watch3 },
  { id: "4", price: 750, name: "Timeless Gold Royale", category: "watches", image: watch4 },
  { id: "5", price: 450, name: "Eden Chrono Elite", category: "watches", image: watch5 },
  { id: "6", price: 620, name: "Eden Chrono Elite", category: "watches", image: watch6 },
  { id: "7", price: 750, name: "Eden Chrono Elite", category: "watches", image: watch7 },
  { id: "8", price: 750, name: "Eden Chrono Elite", category: "watches", image: watch8 },
];

export const LANDING_TESTIMONIALS = [
  { id: "1", name: "Savannah Nguyen", comment: "I’ve owned many luxury watches, but nothing compares to the craftsmanship and personal touch of my Eden Wood timepiece. The ability to customize every detail made it feel truly mine. Worth every penny!", image: testimonial1 },
  {
    id: "2", name: "Ralph Edwards", comment: "From the moment I unboxed my Eden Wood bracelet and sunglasses, I knew I had made the right choice. The ability to customize every detail made it feel truly mine. It’s elegance and meaning in one perfect piece It’s elegance and meaning in one perfect piece!", image: testimonial2
  },
  { id: "3", name: "Esther Howard", comment: "I gifted my husband a custom-engraved Eden Wood watch for our anniversary, and he was blown away. The quality, packaging, and design were beyond expectations. It’s elegance and meaning in one perfect piece!", image: testimonial3 },
];

export const LANDING_FAQS = [
  { id: "1", title: "Can I personalize my watch?", description: "Yes! We offer customization options where you can engrave initials, names, or special messages on the dial, back case, or buckle. Simply select the customization option on the product page." },
  { id: "2", title: "How do I place an order?", description: "Yes! We offer customization options where you can engrave initials, names, or special messages on the dial, back case, or buckle. Simply select the customization option on the product page." },
  { id: "3", title: "Can I modify or cancel my order after placing it?", description: "Yes! We offer customization options where you can engrave initials, names, or special messages on the dial, back case, or buckle. Simply select the customization option on the product page." },
  { id: "4", title: "Do you offer international shipping?", description: "Yes! We offer customization options where you can engrave initials, names, or special messages on the dial, back case, or buckle. Simply select the customization option on the product page." },
  { id: "5", title: "How long does delivery take?", description: "Yes! We offer customization options where you can engrave initials, names, or special messages on the dial, back case, or buckle. Simply select the customization option on the product page." },
  { id: "6", title: "How can I track my order?", description: "Yes! We offer customization options where you can engrave initials, names, or special messages on the dial, back case, or buckle. Simply select the customization option on the product page." },

];