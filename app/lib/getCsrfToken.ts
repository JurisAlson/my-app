export function getCsrfToken() {
  const cookies = document.cookie.split("; ");

  const csrf = cookies.find((cookie) =>
    cookie.startsWith("csrf-token=")
  );

  return csrf?.split("=")[1] ?? "";
} 