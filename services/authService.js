import api from "./api";
import { API } from "./endpoints";

export const authService = {
  register(data) {
    return api.post(API.REGISTER, data);
  },

  login(data) {
    return api.post(API.LOGIN, data);
  },

  logout() {
    return api.post(API.LOGOUT);
  },

  getProfile() {
    return api.get(API.PROFILE);
  },
};