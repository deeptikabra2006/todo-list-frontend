import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Registration failed",
        }
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData);

      // Persist token so the axios interceptor can attach it to future requests
      if (response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
      }

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Login failed",
        }
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await authService.logout();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    } finally {
      // Always clear the persisted token, even if the API call fails
      localStorage.removeItem("token");
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, thunkAPI) => {
    try {
      const response = await authService.getProfile();
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);