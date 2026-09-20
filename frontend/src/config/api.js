export const API_BASE_URL = (process.env.REACT_APP_API_URL || "").replace(
  /\/+$/,
  "",
);

export const apiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};

export const apiFetch = (path, options = {}) => fetch(apiUrl(path), options);

export default API_BASE_URL;
