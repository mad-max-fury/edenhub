export const getAllroutes = (route: object) => [...Object.values(route)];
const LandingPages = {
  HOME: "/",
  ABOUT: "/about",
  SHOP: "/shop",
};

const AuthPages = {
  LOGIN: "/c/login",
  SIGNUP: "/c/sign-up",
  FORGOT_PASSWORD: "/c/forgot-password",
  RESET_PASSWORD: "/c/create-new-password",
  VERIFY_OTP: "/c/verify-otp",
};

const OldStaffPages = {
  OLD_STAFF_ONBOARDING: "/onboarding",
  OLD_STAFF_ONBOARDING_BIO_DATA: "/onboarding/bio-data",
  OLD_STAFF_ONBOARDING_INFO_UPDATE: "/onboarding/update-info",
};

const StaffPages = {
  DASHBOARD: "/staff/dashboard",
  PROFILE: "/staff/profile",
  ORGANIZATIONAL_SETUP_COMPANIES: "/staff/organizational-setup/companies",
  ORGANIZATIONAL_SETUP_LOCATIONS: "/staff/organizational-setup/locations",
  ORGANIZATIONAL_SETUP_DEPARTMENTS: "/staff/organizational-setup/departments",
  ORGANIZATIONAL_SETUP_BUSINESS_UNITS:
    "/staff/organizational-setup/business-units",
  ORGANIZATIONAL_SETUP_JOB_DESIGNATION:
    "/staff/organizational-setup/job-designations",
  ORGANIZATIONAL_SETUP_JOB_TITLES: "/staff/organizational-setup/job-titles",
  ORGANIZATIONAL_SETUP_SETTINGS: "/staff/organizational-setup/settings",
  USER_MANAGEMENT_USERS: "/staff/user-management/users",
  USER_MANAGEMENT_ROLES: "/staff/user-management/roles",
  USER_MANAGEMENT_ROLES_CREATE: "/staff/user-management/roles/create",
  USER_MANAGEMENT_ROLES_EDIT: "/staff/user-management/roles",
  USER_MANAGEMENT_MANAGE_MENU: "/staff/user-management/manage-menu",
  STAFF_ONBOARDING: "/staff/onboarding",
  STAFF_ONBOARDING_BIO_DATA: "/staff/onboarding/bio-data",
  STAFF_ONBOARDING_ID_CARD: "/staff/onboarding/id-card",
  STAFF_ONBOARDING_ATTESTATION: "/staff/onboarding/attestation",
  STAFF_ONBOARDING_REFERENCE_FORM: "/staff/onboarding/reference-form",
  STAFF_ONBOARDING_GUARANTORS_FORM: "/staff/onboarding/guarantors-form",
  STAFF_ONBOARDING_INTEGRATION_FORM: "/staff/onboarding/integration-form",
  STAFF_ONBOARDING_DOCUMENTS: "/staff/onboarding/documents",
  EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE: "/staff/employee-management/all-employee",
  STAFF_LEAVE_REQUESTS: "/staff/leave-management/requests",
  STAFF_LEAVE_TYPES: "/staff/leave-management/types",
  STAFF_LEAVE: "/staff/leave",
  STAFF_LEAVE_APPLY: "/staff/leave/apply",
  STAFF_LEAVE_APPLY_PREVIEW: "/staff/leave/apply/preview",

  STAFF_LEAVE_OVERVIEW: "/staff/leave/overview",
  STAFF_LEAVE_MY_TEAMS: "/staff/leave/my-teams",
  STAFF_LEAVE_MY_DIRECT_REPORT: "/staff/leave/my-direct-report",
  STAFF_SUPERVISOR_APPRAISAL: "/staff/supervisor-appraisal/review-supervisor",

  EMPLOYEE_MANAGEMENT_ENROLLMENT: "/staff/employee-management/enrollment",
  EMPLOYEE_MANAGEMENT_ENROLLMENT_CREATE:
    "/staff/employee-management/enrollment/enroll",
  EMPLOYEE_MANAGEMENT_ENROLLMENT_VIEW:
    "/staff/employee-management/enrollment/view",
  EMPLOYEE_MANAGEMENT_ENROLLMENT_EDIT:
    "/staff/employee-management/enrollment/enroll",
  EMPLOYEE_MANAGEMENT_DOCUMENT_TEMPLATES:
    "/staff/employee-management/document-templates",
  EMPLOYEE_MANAGEMENT_DOCUMENT_CREATE:
    "/staff/employee-management/document-templates/create-document",
  EMPLOYEE_MANAGEMENT_DOCUMENT_PREVIEW:
    "/staff/employee-management/document-templates/preview",
  HR_ANALYTICS: "/staff/hr-analytics",
  NO_ACCESS: "/staff/no-access",
};

export const UNAUTHENTICATED_ROUTES = [
  ...getAllroutes(LandingPages),
  ...getAllroutes(AuthPages),
  ...getAllroutes(OldStaffPages),
];
export const ADMIN_ROUTES = ["/admin/dashboard"];

export const STAFF_ROUTES = [...getAllroutes(StaffPages)];

export const AUTHENTICATED_ROUTES = [...ADMIN_ROUTES, ...STAFF_ROUTES];

export const AuthRouteConfig = {
  ...LandingPages,
  ...AuthPages,
  ...StaffPages,
};
