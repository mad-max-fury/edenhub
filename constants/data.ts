import { AuthRouteConfig } from "./routes";

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
