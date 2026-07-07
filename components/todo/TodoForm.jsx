"use client";

import { useState } from "react";
import useTodo from "@/hooks/useTodo";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import RichTextArea from "@/components/common/RichTextArea";

export default function TodoForm({ onClose }) {
  const { addTodo, loading, error } = useTodo();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    tags: "", // comma separated tags
    imageUrl: "",
  });

  const [subtaskList, setSubtaskList] = useState([]);
  const [currentSubtask, setCurrentSubtask] = useState("");
  const [showSubtasksField, setShowSubtasksField] = useState(true);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addSubtaskItem = (e) => {
    e.preventDefault();
    const cleanSub = currentSubtask.trim();
    if (cleanSub) {
      setSubtaskList((prev) => [...prev, { title: cleanSub, completed: false }]);
      setCurrentSubtask("");
    }
  };

  const removeSubtaskItem = (index) => {
    setSubtaskList((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    // Parse tags: split by comma, trim spaces, and filter empty strings
    const parsedTags = form.tags
      ? form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
      : [];

    let finalSubtasks = [...subtaskList];
    const cleanSub = currentSubtask.trim();
    if (cleanSub) {
      finalSubtasks.push({ title: cleanSub, completed: false });
    }

    const result = await addTodo({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate,
      tags: parsedTags,
      subtasks: finalSubtasks,
      imageUrl: form.imageUrl,
    });

    if (result.meta.requestStatus === "fulfilled") {
      setForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
        tags: "",
        imageUrl: "",
      });
      setSubtaskList([]);
      setShowSubtasksField(true);
      if (onClose) onClose();
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800/80 p-5 sm:p-8 transform transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-450 text-lg font-bold">
            ✍
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">Add New Task</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Create a new task in your schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowSubtasksField(!showSubtasksField)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-205 cursor-pointer border ${showSubtasksField
              ? "bg-indigo-50 border-indigo-200 text-indigo-650 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-400"
              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-707 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
          >
            {showSubtasksField ? "Hide Subtasks" : "➕ Add Checklist"}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer font-extrabold text-sm"
              title="Close modal"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          required
        />
        {/* Task Image Uploader */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
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
              <span className="text-[10px] text-slate-400 dark:text-slate-505 mt-0.5">
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

        <RichTextArea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add some details... (You can use formatting tools above!)"
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Priority Select */}
          <div className="space-y-1.5 w-full">
            <label htmlFor="priority" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Priority <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-950 dark:text-slate-100 bg-white dark:bg-slate-900 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 cursor-pointer"
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

          {/* Tags */}
          <Input
            label="Tags (comma separated)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Work, Personal, Urgent"
          />
        </div>

        {/* Subtask Builder Panel */}
        {showSubtasksField && (
          <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Task Checklist Items
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentSubtask}
                onChange={(e) => setCurrentSubtask(e.target.value)}
                placeholder="Enter checklist item..."
                className="flex-1 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 shadow-sm focus:outline-none focus:border-blue-500 transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSubtaskItem(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={addSubtaskItem}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-700 dark:hover:bg-blue-650 transition cursor-pointer"
              >
                Add
              </button>
            </div>

            {subtaskList.length > 0 && (
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {subtaskList.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-xs"
                  >
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.title}</span>
                    <button
                      type="button"
                      onClick={() => removeSubtaskItem(idx)}
                      className="text-red-400 hover:text-red-600 font-bold text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-650 dark:text-red-400 text-xs font-semibold rounded-xl px-4 py-3 mb-4 animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          fullWidth
          variant="primary"
          className="mt-2"
        >
          Add Task
        </Button>
      </div>
    </form>
  );
}