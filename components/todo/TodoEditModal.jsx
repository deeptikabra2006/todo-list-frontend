"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import RichTextArea from "@/components/common/RichTextArea";

export default function TodoEditModal({ todo, isOpen, onClose, onSave }) {
  const { error } = useSelector((state) => state.todo || {});
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "PENDING",
    dueDate: "",
    tags: [],
    subtasks: [],
    imageUrl: "",
  });

  const [newTag, setNewTag] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (todo && isOpen) {
      const handle = requestAnimationFrame(() => {
        setForm({
          title: todo.title || "",
          description: todo.description || "",
          priority: todo.priority || "MEDIUM",
          status: todo.status || "PENDING",
          dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : "",
          tags: todo.tags || [],
          subtasks: todo.subtasks ? todo.subtasks.map(sub => ({ ...sub })) : [],
          imageUrl: todo.imageUrl || "",
        });
        setNewTag("");
        setNewSubtask("");
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [todo, isOpen]);

  if (!isOpen || !todo || !mounted) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addTag = (e) => {
    e.preventDefault();
    const cleanTag = newTag.trim();
    if (cleanTag && !form.tags.includes(cleanTag)) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, cleanTag],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addSubtask = (e) => {
    e.preventDefault();
    const cleanSub = newSubtask.trim();
    if (cleanSub) {
      setForm((prev) => ({
        ...prev,
        subtasks: [...prev.subtasks, { title: cleanSub, completed: false }],
      }));
      setNewSubtask("");
    }
  };

  const toggleSubtask = (index) => {
    setForm((prev) => {
      const updated = prev.subtasks.map((sub, i) =>
        i === index ? { ...sub, completed: !sub.completed } : sub
      );
      return { ...prev, subtasks: updated };
    });
  };

  const removeSubtask = (index) => {
    setForm((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    let finalTags = [...form.tags];
    const cleanTag = newTag.trim();
    if (cleanTag && !finalTags.includes(cleanTag)) {
      finalTags.push(cleanTag);
    }

    let finalSubtasks = [...form.subtasks];
    const cleanSub = newSubtask.trim();
    if (cleanSub) {
      finalSubtasks.push({ title: cleanSub, completed: false });
    }
    
    await onSave(todo._id, {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      tags: finalTags,
      subtasks: finalSubtasks,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 border border-slate-100 dark:border-slate-800 flex flex-col transform transition-all duration-300 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xl">✏️</span>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">Edit Task Details</h2>
              <p className="text-xs text-slate-505 dark:text-slate-400 font-medium">Modify task settings and checklist items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 flex-1">
          {/* Title */}
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task title"
            required
          />
                  {/* Task Image Uploader */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-705 dark:text-slate-300">
              Task Cover Image (Optional)
            </label>
            {form.imageUrl ? (
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 group">
                <img
                  src={form.imageUrl}
                  alt="Task attachment preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, imageUrl: "" }))}
                  className="absolute top-2.5 right-2.5 bg-slate-950/60 hover:bg-slate-950 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs transition cursor-pointer font-bold"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/20 hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-300">
                <span className="text-xl mb-1">🖼️</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Upload cover/attachment image
                </span>
                <span className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">
                  Supports JPG, PNG (Max 2MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert("Image size must be less than 2MB");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Description */}
          <RichTextArea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add details about this task... (Support Markdown formatting!)"
            rows={3}
          />

          {/* Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Status Selector */}
            <div className="space-y-1.5">
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-950 dark:text-slate-100 bg-white dark:bg-slate-900 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:ring-blue-500/5 transition-all duration-300 cursor-pointer"
              >
                <option value="PENDING">⏳ Pending</option>
                <option value="IN_PROGRESS">⚡ In Progress</option>
                <option value="COMPLETED">✅ Completed</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="space-y-1.5">
              <label htmlFor="modal-priority" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Priority <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <select
                id="modal-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-950 dark:text-slate-100 bg-white dark:bg-slate-900 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:ring-blue-500/5 transition-all duration-300 cursor-pointer"
              >
                <option value="HIGH">🔴 High</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">🟢 Low</option>
              </select>
            </div>

            {/* Due Date */}
            <Input
              label="Due Date"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Tags Management */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-705 dark:text-slate-300">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(e);
                  }
                }}
                placeholder="Add tag (e.g. Work, Personal)"
                className="flex-1 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-950 dark:text-slate-100 bg-white dark:bg-slate-900 shadow-sm focus:outline-none focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2.5 bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-slate-900 dark:hover:bg-slate-650 transition-all cursor-pointer"
              >
                Add Tag
              </button>
            </div>
            {form.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/80 dark:border-blue-900/40 px-2.5 py-1 rounded-xl text-xs font-bold"
                  >
                    🏷️ {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-400 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100 ml-0.5 cursor-pointer font-extrabold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">No tags added yet.</p>
            )}
          </div>

          {/* Subtasks / Checklist Management */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-semibold text-slate-750 dark:text-slate-300">Subtasks Checklist</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addSubtask(e);
                  }
                }}
                placeholder="Add new subtask item..."
                className="flex-1 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 shadow-sm focus:outline-none focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={addSubtask}
                className="px-4 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-xl text-sm font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all cursor-pointer"
              >
                Add Subtask
              </button>
            </div>

            {form.subtasks.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30">
                {form.subtasks.map((sub, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition hover:border-slate-200 dark:hover:border-slate-750"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => toggleSubtask(index)}
                        className="w-4.5 h-4.5 text-blue-600 dark:text-blue-500 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span
                        className={`text-sm font-medium text-slate-800 dark:text-slate-200 truncate ${
                          sub.completed ? "line-through text-slate-400 dark:text-slate-550" : ""
                        }`}
                      >
                        {sub.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="text-red-400 dark:text-red-500 hover:text-red-650 dark:hover:text-red-400 font-bold p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Add a subtask to break this task down.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-650 dark:text-red-400 text-xs font-semibold rounded-xl px-4 py-3 mb-2 animate-pulse w-full text-center">
                ⚠️ {error}
              </div>
            )}
            <div className="flex justify-end gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="submit"
                variant="primary"
                className="px-6 py-3 rounded-xl text-sm font-bold shadow-md shadow-blue-500/10 dark:shadow-blue-900/50"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
