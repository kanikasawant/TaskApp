import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import TaskCard from "../components/TaskCard";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch {
      showToast("Failed to fetch tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const addTask = async () => {
    if (!title.trim()) {
      showToast("Task title cannot be empty", "error");
      return;
    }
    try {
      await API.post("/tasks", {
        title: title.trim(),
        description: description.trim(),
        due_date: new Date().toISOString().split("T")[0],
      });
      setTitle("");
      setDescription("");
      showToast("Task added");
      fetchTasks();
    } catch {
      showToast("Failed to add task", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    showToast("Logged out");
    setTimeout(() => navigate("/login"), 500);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.status === "completed") ||
      (filterStatus === "pending" && task.status === "pending");
    return matchesSearch && matchesStatus;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#fde68a_0%,_transparent_40%),radial-gradient(circle_at_top_left,_#bfdbfe_0%,_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]" />

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed right-5 top-5 z-50 rounded-xl px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-md animate-[slideIn_.24s_ease-out] ${
            toast.type === "success"
              ? "bg-emerald-600/95 text-white"
              : "bg-rose-600/95 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 font-black text-white shadow-[0_10px_30px_rgba(79,70,229,0.35)]">
              TF
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Taskflow
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Your personal productivity companion
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 py-8">

        {/* Stats */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {[["Total Tasks", totalTasks], ["Completed", completedTasks], ["Pending", pendingTasks], ["Completion", `${completionRate}%`]].map(
            ([label, value]) => (
              <div
                key={label}
                className="group rounded-2xl border border-white/70 bg-white/85 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(79,70,229,0.16)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {label}
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                  {value}
                </p>
              </div>
            )
          )}
        </section>

        {/* Progress */}
        <section className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="flex justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Overall Progress
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              {completedTasks}/{totalTasks} completed
            </p>
          </div>
          <div className="h-3 rounded-full bg-slate-200/90">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </section>

        {/* Create Task */}
        <section className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <h3 className="mb-4 text-lg font-bold text-slate-900">
            Create New Task
          </h3>
          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              placeholder="What needs to be done?"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              placeholder="Add a short description (optional)"
            />
            <div className="flex justify-end">
              <button
                onClick={addTask}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 font-semibold text-white shadow-[0_8px_24px_rgba(79,70,229,0.35)] transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-600"
              >
                Add
              </button>
            </div>
          </div>
        </section>

        {/* Tasks */}
        <section>
          {loading ? (
            <p className="text-center font-medium text-slate-500">
              Loading...
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  refresh={fetchTasks}
                  onNotify={showToast}
                  index={i}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}