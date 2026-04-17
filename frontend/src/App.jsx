import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

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

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/listSchools`);
      setSchools(res.data);

      if (res.data.length > 0) {
        setSelectedSchool(res.data[0]);
      }
    } catch {
      toast.error("Failed to fetch schools");
    } finally {
      setLoading(false);
    }
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
    if (!window.confirm("Delete school?")) return;

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

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900"
      }`}
    >
      <Toaster position="top-right" />

      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full"></div>

      <div className="relative flex min-h-screen">

        {/* Sidebar */}
        <aside className="w-72 p-6 border-r border-white/10 bg-white/5 backdrop-blur-xl">
          <h1 className="text-2xl font-black mb-8">🏫 SchoolOS</h1>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 shadow-xl">
              <p className="text-sm opacity-80">Total Schools</p>
              <h2 className="text-3xl font-bold">{schools.length}</h2>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">

          <div>
            <h2 className="text-5xl font-black mb-2">School Dashboard</h2>
            <p className={`${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Smart school location management platform
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mt-8">

            {/* Add School */}
            <div className="rounded-3xl p-6 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
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
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/10 outline-none"
                  />
                ))}

                <button
                  onClick={addSchool}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 font-semibold"
                >
                  Add School
                </button>
              </div>
            </div>

            {/* Schools List */}
            <div className="rounded-3xl p-6 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <h3 className="text-2xl font-bold mb-4">Schools</h3>

              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl mb-4 border border-white/10 bg-white/10"
              />

              {loading ? (
                <div className="text-center py-12 opacity-60">Loading...</div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto">
                  {filteredSchools.map((school) => (
                    <div
                      key={school.id}
                      onClick={() => setSelectedSchool(school)}
                      className="p-4 rounded-2xl bg-white/10 hover:bg-violet-500/20 cursor-pointer transition-all"
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
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            <div className="rounded-3xl p-4 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
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

      {/* Edit Modal */}
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