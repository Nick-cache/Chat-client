export const LMS_DOMAIN_LINK = process.env.LMS_DOMAIN_LINK;
export const BACKEND_DOMAIN_LINK = process.env.BACKEND_DOMAIN_LINK;
export const LMS_SOCKET = process.env.LMS_SOCKET;

export const DEV = Boolean(process.env.FRONTEND_DEV);
export const BACKEND_DOMAIN_LINK_DEV = process.env.BACKEND_DOMAIN_LINK_DEV;
export const LMS_DOMAIN_LINK_DEV = process.env.LMS_DOMAIN_LINK_DEV;

export const backend_link = BACKEND_DOMAIN_LINK_DEV
  ? BACKEND_DOMAIN_LINK_DEV
  : BACKEND_DOMAIN_LINK;
export const lms_link = DEV ? LMS_DOMAIN_LINK_DEV : LMS_DOMAIN_LINK;
export const lms_socket = DEV ? LMS_DOMAIN_LINK_DEV : LMS_SOCKET;
