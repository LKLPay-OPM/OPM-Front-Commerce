import * as cookie from "cookie";
/* environment */
import { PUBLIC_APPWRITE_PROJECT_ID } from "$env/static/public";

export function getSession(event) {
  const cookieStr = event.request.headers.get("cookie");
  const cookies = cookie.parse(cookieStr ?? "");
  const authCookie =
    cookies[`a_session_${PUBLIC_APPWRITE_PROJECT_ID.toLowerCase()}_legacy`];

  return {
    authCookie,
  };
}
