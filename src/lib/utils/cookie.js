export function setCookie(cookies, varName, data) {
  cookies.set(varName, data, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function getCookie(cookies, varName) {
  return cookies.get(varName);
}
