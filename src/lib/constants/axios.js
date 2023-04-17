/** @typedef {import('axios').CreateAxiosDefaults} CreateAxiosDefaults */

/** @type {CreateAxiosDefaults} */
export const axiosDefaultsClientJson = {
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

/** @type {CreateAxiosDefaults} */
export const axiosDefaultsClientFormData = {
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
};
