import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function App() {
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

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/listSchools`);
      const data = await res.json();

      setSchools(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length > 0) {
        setSelectedSchool(data[0]);
      }
    } catch (err) {
      toast.error("Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const addSchool = async () => {
    if (!form.name || !form.address || !form.latitude || !form.longitude) {
      toast.error("All fields required");
      return;
    }

    try {
      await fetch(`${API}/addSchool`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

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
      await fetch(`${API}/deleteSchool/${id}`, {
        method: "DELETE",
      });

      toast.success("Deleted");
      fetchSchools();
    } catch {
      toast.error("Delete failed");
    }
  };

  const updateSchool = async () => {
    if (!editingSchool) return;

    try {
      await fetch(`${API}/updateSchool/${editingSchool.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSchool),
      });

      toast.success("Updated");
      setEditingSchool(null);
      fetchSchools();
    } catch {
      toast.error("Update failed");
    }
  };

  const filteredSchools = useMemo(() => {
    return schools.filter((school) =>
      (school.name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [schools, search]);

  return (
    <div className={darkMode ? "min-h-screen bg-slate-950 text-white" : "min-h-screen bg-slate-100 text-slate-900"}>
      <Toaster position="top-right" />

      <div className="flex min-h-screen">
        <aside className="w-72 p-6 border-r border-white/10 bg-white/5">
          <h1 className="text-2xl font-black mb-8">🏫 SchoolOS</h1>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-violet-600">
              <p>Total Schools</p>
              <h2 className="text-3xl font-bold">{schools.length}</h2>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full py-3 rounded-2xl bg-slate-700"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <h2 className="text-4xl font-black mb-6">School Dashboard</h2>

          <div className="grid lg:grid-cols-3 gap-8">

            <div className="rounded-3xl p-6 border bg-white/5">
              <h3 className="text-2xl font-bold mb-4">Add School</h3>

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
                    className="w-full px-4 py-3 rounded-xl text-black"
                  />
                ))}

                <button
                  onClick={addSchool}
                  className="w-full py-3 rounded-xl bg-violet-600"
                >
                  Add School
                </button>
              </div>
            </div>

            <div className="rounded-3xl p-6 border bg-white/5">
              <h3 className="text-2xl font-bold mb-4">Schools</h3>

              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl mb-4 text-black"
              />

              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="space-y-3">
                  {filteredSchools.map((school) => (
                    <div
                      key={school.id}
                      className="p-4 rounded-xl bg-white/10"
                      onClick={() => setSelectedSchool(school)}
                    >
                      <h4>{school.name}</h4>
                      <p>{school.address}</p>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSchool(school);
                          }}
                          className="px-3 py-1 bg-blue-500 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSchool(school.id);
                          }}
                          className="px-3 py-1 bg-red-500 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl p-4 border bg-white/5">
              <h3 className="text-2xl font-bold mb-4">Map</h3>

              {selectedSchool ? (
                <iframe
                  title="map"
                  width="100%"
                  height="400"
                  src={`https://www.google.com/maps?q=${selectedSchool.latitude},${selectedSchool.longitude}&output=embed`}
                />
              ) : (
                <div>Select school</div>
              )}
            </div>
          </div>
        </main>
      </div>

      {editingSchool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white text-black p-8 rounded-2xl w-[400px]">
            <h2 className="text-xl font-bold mb-4">Edit School</h2>

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
                className="w-full px-4 py-3 rounded-xl border mb-3"
              />
            ))}

            <div className="flex gap-3">
              <button onClick={updateSchool} className="flex-1 py-3 bg-violet-600 text-white rounded-xl">
                Save
              </button>

              <button onClick={() => setEditingSchool(null)} className="flex-1 py-3 bg-slate-300 rounded-xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}