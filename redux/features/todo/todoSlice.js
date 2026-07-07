import { createSlice } from "@reduxjs/toolkit";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleStatus,
} from "./todoThunk";

const initialState = {
  todos: [],
  totalCount: 0,
  totalPages: 1,
  stats: {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 0,
  },
  loading: false,
  error: null,
  toast: null,
};

const todoSlice = createSlice({
  name: "todo",
  initialState,

  reducers: {
    // Clear error state (useful for dismissing error messages)
    clearError: (state) => {
      state.error = null;
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Get Todos
      .addCase(getTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.loading = false;
        console.log("REDUX getTodos.fulfilled payload:", action.payload);
        if (action.payload && Array.isArray(action.payload.todos)) {
          state.todos = action.payload.todos;
          state.totalCount = action.payload.totalCount;
          state.totalPages = action.payload.totalPages;
          state.stats = action.payload.stats || {
            total: action.payload.todos.length,
            completed: action.payload.todos.filter((t) => t.status === "COMPLETED").length,
            inProgress: action.payload.todos.filter((t) => t.status === "IN_PROGRESS").length,
            pending: action.payload.todos.filter((t) => t.status === "PENDING").length,
            completionRate: 0,
          };
        } else {
          state.todos = action.payload || [];
          state.totalCount = (action.payload || []).length;
          state.totalPages = 1;
          state.stats = {
            total: (action.payload || []).length,
            completed: (action.payload || []).filter((t) => t.status === "COMPLETED").length,
            inProgress: (action.payload || []).filter((t) => t.status === "IN_PROGRESS").length,
            pending: (action.payload || []).filter((t) => t.status === "PENDING").length,
            completionRate: 0,
          };
        }
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.toast = {
          message: `❌ ${action.payload || "Failed to load tasks"}`,
          type: "error",
        };
      })

      // Create Todo
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.unshift(action.payload);
        state.totalCount += 1;
        state.stats.total += 1;
        if (action.payload.status === "COMPLETED") {
          state.stats.completed += 1;
        } else if (action.payload.status === "IN_PROGRESS") {
          state.stats.inProgress += 1;
        } else {
          state.stats.pending += 1;
        }
        const total = state.stats.total;
        state.stats.completionRate = total > 0 ? Math.round((state.stats.completed / total) * 100) : 0;
        state.toast = {
          message: `🎉 Task "${action.payload.title}" created successfully!`,
          type: "success",
        };
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.toast = {
          message: `❌ ${action.payload || "Failed to create task"}`,
          type: "error",
        };
      })

      // Update Todo
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.todos.findIndex(
          (todo) => todo._id === action.payload._id
        );

        if (index !== -1) {
          const oldTask = state.todos[index];
          if (oldTask.status !== action.payload.status) {
            if (oldTask.status === "COMPLETED") {
              state.stats.completed = Math.max(0, state.stats.completed - 1);
            } else if (oldTask.status === "IN_PROGRESS") {
              state.stats.inProgress = Math.max(0, state.stats.inProgress - 1);
            } else {
              state.stats.pending = Math.max(0, state.stats.pending - 1);
            }

            if (action.payload.status === "COMPLETED") {
              state.stats.completed += 1;
            } else if (action.payload.status === "IN_PROGRESS") {
              state.stats.inProgress += 1;
            } else {
              state.stats.pending += 1;
            }
          }
          state.todos[index] = action.payload;
        }
        const total = state.stats.total;
        state.stats.completionRate = total > 0 ? Math.round((state.stats.completed / total) * 100) : 0;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.toast = {
          message: `❌ ${action.payload || "Failed to update task"}`,
          type: "error",
        };
      })

      // Delete Todo
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        const deletedTask = state.todos.find(
          (todo) => todo._id === action.payload
        );
        const taskTitle = deletedTask ? deletedTask.title : "Task";
        
        if (deletedTask) {
          state.totalCount = Math.max(0, state.totalCount - 1);
          state.stats.total = Math.max(0, state.stats.total - 1);
          if (deletedTask.status === "COMPLETED") {
            state.stats.completed = Math.max(0, state.stats.completed - 1);
          } else if (deletedTask.status === "IN_PROGRESS") {
            state.stats.inProgress = Math.max(0, state.stats.inProgress - 1);
          } else {
            state.stats.pending = Math.max(0, state.stats.pending - 1);
          }
        }

        state.todos = state.todos.filter(
          (todo) => todo._id !== action.payload
        );
        
        const total = state.stats.total;
        state.stats.completionRate = total > 0 ? Math.round((state.stats.completed / total) * 100) : 0;
        state.toast = {
          message: `🗑️ Task "${taskTitle}" deleted successfully!`,
          type: "success",
        };
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.toast = {
          message: `❌ ${action.payload || "Failed to delete task"}`,
          type: "error",
        };
      })

      // Toggle Status
      .addCase(toggleStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleStatus.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.todos.findIndex(
          (todo) => todo._id === action.payload._id
        );

        if (index !== -1) {
          const oldTask = state.todos[index];
          if (oldTask.status !== action.payload.status) {
            if (oldTask.status === "COMPLETED") {
              state.stats.completed = Math.max(0, state.stats.completed - 1);
            } else if (oldTask.status === "IN_PROGRESS") {
              state.stats.inProgress = Math.max(0, state.stats.inProgress - 1);
            } else {
              state.stats.pending = Math.max(0, state.stats.pending - 1);
            }

            if (action.payload.status === "COMPLETED") {
              state.stats.completed += 1;
            } else if (action.payload.status === "IN_PROGRESS") {
              state.stats.inProgress += 1;
            } else {
              state.stats.pending += 1;
            }
          }
          state.todos[index] = action.payload;
        }
        const total = state.stats.total;
        state.stats.completionRate = total > 0 ? Math.round((state.stats.completed / total) * 100) : 0;
      })
      .addCase(toggleStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.toast = {
          message: `❌ ${action.payload || "Failed to change task status"}`,
          type: "error",
        };
      });
  },
});

export const { clearError, setToast, clearToast } = todoSlice.actions;
export default todoSlice.reducer;