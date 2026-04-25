export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// We have removed the Manus OAuth dependencies.
// The login URL is now just returning the home page or a local login page if needed.
export const getLoginUrl = () => {
  return "/";
};
