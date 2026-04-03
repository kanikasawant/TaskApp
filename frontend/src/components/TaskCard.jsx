import API from "../api";

const accentColors = [
  "border-indigo-500",
  "border-emerald-500",
  "border-amber-500",
  "border-sky-500",
  "border-violet-500",
];

export default function TaskCard({ task, refresh, onNotify, index }) {
  const accent = accentColors[index % accentColors.length];
  const isCompleted = task.status === "completed";

  const toggleStatus = async () => {
    try {
      await API.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description || "",
        due_date: task.due_date,
        status: task.status === "completed" ? "pending" : "completed",
      });

      onNotify(
        task.status === "completed" ? "Task marked as pending" : "Task completed",
        "success"
      );

      refresh();
    } catch (err) {
      console.error(err.response?.data || err);
      onNotify("Failed to update task", "error");
    }
  };

  const deleteTask = async () => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/tasks/${task.id}`);
      onNotify("Task deleted", "success");
      refresh();
    } catch (err) {
      onNotify("Failed to delete task", "error");
    }
  };

  return (
    <div
      className={`rounded-2xl border ${accent} border-l-4 bg-white/90 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(79,70,229,0.18)] ${isCompleted ? "opacity-80" : ""}`}
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3
          className={`text-xl font-bold tracking-tight ${
            isCompleted
              ? "line-through text-gray-500"
              : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isCompleted
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {isCompleted ? "Done" : "Pending"}
        </span>
      </div>

      {/* Description */}
      <p className="mb-5 min-h-10 text-sm leading-6 text-gray-600">
        {task.description || "No description"}
      </p>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={toggleStatus}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            isCompleted
              ? "bg-gray-100 text-indigo-600 hover:bg-gray-200"
              : "bg-linear-to-r from-indigo-600 to-violet-500 text-white hover:from-indigo-700 hover:to-violet-600"
          }`}
        >
          {isCompleted ? "Undo" : "Complete"}
        </button>

        <button
          onClick={deleteTask}
          className="rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}