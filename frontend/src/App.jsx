import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

function App() {
  const API = "https://school-location-management-system.onrender.com/api";

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [editingSchool, setEditingSchool] = useState(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/listSchools`);
      setSchools(res.data);
      if (res.data.length) setSelectedSchool(res.data[0]);
    } catch {
      toast.error("Failed to fetch schools");
    }
    setLoading(false);
  };

  const addSchool = async () => {
    if (!form.name || !form.address || !form.latitude || !form.longitude) {
      toast.error("All fields required");
      return;
    }

    try {
      await axios.post(`${API}/addSchool`, form);
      toast.success("School added");
      setForm({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
      });
      fetchSchools();
    } catch {
      toast.error("Add failed");
    }
  };

  const deleteSchool = async (id) => {
    if (!window.confirm("Delete this school?")) return;

    try {
      await axios.delete(`${API}/deleteSchool/${id}`);
      toast.success("Deleted");
      fetchSchools();
    } catch {
      toast.error("Delete failed");
    }
  };

  const updateSchool = async () => {
    try {
      await axios.put(`${API}/updateSchool/${editingSchool.id}`, editingSchool);
      toast.success("Updated");
      setEditingSchool(null);
      fetchSchools();
    } catch {
      toast.error("Update failed");
    }
  };

  const filteredSchools = useMemo(() => {
    return schools.filter((school) =>
      school.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [schools, search]);

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportCSV = () => {
    const rows = [
      ["Name", "Address", "Latitude", "Longitude"],
      ...schools.map((s) => [s.name, s.address, s.latitude, s.longitude]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "schools.csv";
    a.click();
  };

  const nearestSchool = schools.length
    ? schools.reduce((prev, curr) =>
        Math.abs(curr.latitude) < Math.abs(prev.latitude) ? curr : prev
      )
    : null;

  return (
    <div
      className={`min-h-screen transition-all duration-700 relative overflow-hidden ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900"
      }`}
    >
      <Toaster position="top-right" />

      {/* Premium glow */}
      <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-violet-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-blue-500/20 blur-3xl rounded-full"></div>
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-fuchsia-500/10 blur-3xl rounded-full"></div>

      <div className="relative flex min-h-screen">

        {/* Sidebar */}
        <aside
          className={`w-72 p-6 border-r ${
            darkMode
              ? "bg-white/5 border-white/10 backdrop-blur-xl"
              : "bg-white/70 border-slate-200 backdrop-blur-xl"
          }`}
        >
          <h1 className="text-2xl font-black mb-8">🏫 SchoolOS</h1>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 shadow-xl">
              <p className="text-sm opacity-80">Total Schools</p>
              <h2 className="text-3xl font-bold">{schools.length}</h2>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/20">
              <p className="text-sm">Nearest School</p>
              <h3 className="font-bold">
                {nearestSchool ? nearestSchool.name : "—"}
              </h3>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              onClick={exportCSV}
              className="w-full py-3 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 transition-all"
            >
              Export CSV
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-2 leading-tight">
              School Dashboard
            </h2>
            <p className={`${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Smart school location management platform
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mt-8">

            {/* Form */}
            <div className={`rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-xl ${
              darkMode ? "bg-white/5" : "bg-white/80"
            }`}>
              <h3 className="text-2xl font-bold mb-5">Add School</h3>

              <div className="space-y-4">
                {["name", "address", "latitude", "longitude"].map((field) => (
                  <input
                    key={field}
                    placeholder={field}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [field]: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/10 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                  />
                ))}

                <button
                  onClick={addSchool}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 font-semibold shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  Add School
                </button>
              </div>
            </div>

            {/* List */}
            <div className={`rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-xl ${
              darkMode ? "bg-white/5" : "bg-white/80"
            }`}>
              <h3 className="text-2xl font-bold">Schools</h3>
              <p className="text-sm opacity-60 mb-4">Manage registered locations</p>

              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl mb-4 border border-white/10 bg-white/10 focus:ring-2 focus:ring-violet-500 outline-none"
              />

              {!loading && paginatedSchools.length === 0 && (
                <div className="text-center py-16 opacity-60">
                  No schools found 🏫
                </div>
              )}

              <div className="space-y-3 max-h-[420px] overflow-y-auto">
                {paginatedSchools.map((school) => (
                  <motion.div
                    key={school.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedSchool(school)}
                    className={`p-4 rounded-2xl cursor-pointer hover:shadow-2xl transition-all duration-300 ${
                      selectedSchool?.id === school.id
                        ? "bg-violet-500/20"
                        : "bg-white/10"
                    }`}
                  >
                    <h4 className="font-semibold">{school.name}</h4>
                    <p className="text-sm opacity-70">{school.address}</p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSchool(school);
                        }}
                        className="px-3 py-1 rounded-lg bg-blue-500/20 text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSchool(school.id);
                        }}
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className={`rounded-3xl p-4 shadow-2xl border border-white/10 backdrop-blur-xl ${
              darkMode ? "bg-white/5" : "bg-white/80"
            }`}>
              <h3 className="text-2xl font-bold mb-4">Live Map</h3>

              {selectedSchool ? (
                <iframe
                  title="map"
                  width="100%"
                  height="420"
                  className="rounded-2xl"
                  src={`https://www.google.com/maps?q=${selectedSchool.latitude},${selectedSchool.longitude}&output=embed`}
                ></iframe>
              ) : (
                <div className="h-[420px] flex items-center justify-center opacity-50">
                  Select school
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {editingSchool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-slate-900 rounded-3xl p-8 w-[420px] shadow-2xl">

            <h2 className="text-2xl font-bold mb-5">Edit School</h2>

            <div className="space-y-4">
              {["name", "address", "latitude", "longitude"].map((field) => (
                <input
                  key={field}
                  value={editingSchool[field]}
                  onChange={(e) =>
                    setEditingSchool({
                      ...editingSchool,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border"
                />
              ))}

              <div className="flex gap-3">
                <button
                  onClick={updateSchool}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingSchool(null)}
                  className="flex-1 py-3 rounded-2xl bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;