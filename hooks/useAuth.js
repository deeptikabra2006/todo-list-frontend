"use client";

import { useDispatch, useSelector } from "react-redux";

import {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
} from "@/redux/features/auth/authThunk";

export default function useAuth() {
  const dispatch = useDispatch();

  const { user, token, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,

    login: (data) => dispatch(loginUser(data)),

    register: (data) => dispatch(registerUser(data)),

    logout: () => dispatch(logoutUser()),

    profile: () => dispatch(getProfile()),
  };
}