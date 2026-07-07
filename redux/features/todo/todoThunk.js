import { createAsyncThunk } from "@reduxjs/toolkit";
import { todoService } from "@/services/todoService";

// Get All Todos
export const getTodos = createAsyncThunk(
  "todo/getTodos",
  async (params = {}, thunkAPI) => {
    try {
      const response = await todoService.getTodos(params);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch todos"
      );
    }
  }
);

// Create Todo
export const createTodo = createAsyncThunk(
  "todo/createTodo",
  async (todoData, thunkAPI) => {
    try {
      const response = await todoService.createTodo(todoData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create todo"
      );
    }
  }
);

// Update Todo
export const updateTodo = createAsyncThunk(
  "todo/updateTodo",
  async ({ id, todoData }, thunkAPI) => {
    try {
      const response = await todoService.updateTodo(id, todoData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update todo"
      );
    }
  }
);

// Delete Todo
export const deleteTodo = createAsyncThunk(
  "todo/deleteTodo",
  async (id, thunkAPI) => {
    try {
      await todoService.deleteTodo(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete todo"
      );
    }
  }
);

// Toggle Todo Status
export const toggleStatus = createAsyncThunk(
  "todo/toggleStatus",
  async (id, thunkAPI) => {
    try {
      const response = await todoService.toggleStatus(id);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to toggle status"
      );
    }
  }
);