import { jwtDecode } from "jwt-decode";

export const getUserFromJwt = () => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.sub;
};

export const getExpireTimeFromJwt = () => {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.exp;
};
