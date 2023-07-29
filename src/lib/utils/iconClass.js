export function getIconStatusClass(status) {
  if (status === "approved") {
    return "success";
  }
  if (status === "cancelled") {
    return "error";
  }
  if (status === "declined") {
    return "warning";
  }
  return "";
}
