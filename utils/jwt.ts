import { jwtDecode } from "jwt-decode";

export const getUserFromJwt = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.sub;
};

export const getExpireTimeFromJwt = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.exp;
};
