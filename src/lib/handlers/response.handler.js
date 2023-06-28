export function appResponseHandler(data) {
  if (typeof data?.response === "undefined") {
    throw new Error("Datos indefinidos");
  }
  return data.response;
}
