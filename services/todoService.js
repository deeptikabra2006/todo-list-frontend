import api from "./api";
import { API } from "./endpoints";

export const todoService = {

    getTodos(params = {}) {
        return api.get(API.TODOS, { params });
    },

    getTodoById(id) {
        return api.get(`${API.TODOS}/${id}`);
    },

    createTodo(data) {
        return api.post(API.TODOS, data);
    },

    updateTodo(id, data) {
        return api.put(`${API.TODOS}/${id}`, data);
    },

    deleteTodo(id) {
        return api.delete(`${API.TODOS}/${id}`);
    },

    toggleStatus(id) {
        return api.patch(`${API.TODOS}/${id}/status`);
    },

};