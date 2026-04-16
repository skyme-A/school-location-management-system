import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const API = "https://school-location-management-system.onrender.com";

  const [schools, setSchools] = useState([]);
  const [form, setForm] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const [editingSchool, setEditingSchool] = useState(null);
  const [editedName, setEditedName] = useState("");

  const fetchSchools = async () => {
    const res = await axios.get(`${API}/api/schools`);
    setSchools(res.data);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const addSchool = async () => {
    if (!form.name || !form.latitude || !form.longitude) return;

    await axios.post(`${API}/api/addSchool`, form);

    setForm({
      name: "",
      latitude: "",
      longitude: "",
    });

    fetchSchools();
  };

  const deleteSchool = async (id) => {
    await axios.delete(`${API}/api/deleteSchool/${id}`);
    fetchSchools();
  };

  const editSchool = (school) => {
    setEditingSchool(school);
    setEditedName(school.name);
  };

  const saveEdit = async () => {
    await axios.put(`${API}/api/updateSchool/${editingSchool.id}`, {
      name: editedName,
      latitude: editingSchool.latitude,
      longitude: editingSchool.longitude,
    });

    setEditingSchool(null);
    fetchSchools();
  };

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(search.toLowerCase())
  );

  const nearestSchool =
    schools.length > 0
      ? schools.reduce((prev, curr) =>
        prev.distance < curr.distance ? prev : curr
      )
      : null;

  return (
    <div
      className={`min-h-screen overflow-y-auto transition-all duration-700 ease-in-out px-6 py-8 ${darkMode
          ? "bg-gradient-to-br from-purple-950 via-violet-800 to-indigo-900 text-white"
          : "bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 text-gray-900"
        }`}
    >
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-6xl font-extrabold tracking-tight drop-shadow-lg">
            School Location Dashboard
          </h1>

          <p className={`mt-2 text-lg ${darkMode ? "text-white/70" : "text-slate-500"}`}>
            Smart school management with distance intelligence
          </p>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-5 py-2 rounded-full bg-white/40 border border-white/50 backdrop-blur-xl hover:scale-105 transition-all duration-300 active:scale-95 shadow-md"
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </div>

        <div
          className={`mb-6 backdrop-blur-3xl rounded-3xl shadow-2xl p-6 text-center border ${darkMode
              ? "bg-white/10 border-white/20 shadow-purple-500/30"
              : "bg-white/60 border-white/50 shadow-xl shadow-purple-100"
            }`}
        >
          <h2 className="text-2xl font-semibold">Total Schools</h2>
          <p className="text-5xl font-bold mt-2 animate-pulse">{schools.length}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`rounded-2xl p-4 text-center backdrop-blur-xl ${darkMode ? "bg-white/10" : "bg-white/60 shadow-md border border-white/50"}`}>
            <p className="text-sm opacity-70">Nearest</p>
            <p className="font-bold">{nearestSchool?.name || "-"}</p>
          </div>

          <div className={`rounded-2xl p-4 text-center backdrop-blur-xl ${darkMode ? "bg-white/10" : "bg-white/60 shadow-md border border-white/50"}`}>
            <p className="text-sm opacity-70">Active Records</p>
            <p className="font-bold">{schools.length}</p>
          </div>

          <div className={`rounded-2xl p-4 text-center backdrop-blur-xl ${darkMode ? "bg-white/10" : "bg-white/60 shadow-md border border-white/50"}`}>
            <p className="text-sm opacity-70">System</p>
            <p className="font-bold text-green-500">Online</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className={`backdrop-blur-3xl rounded-3xl shadow-2xl p-8 border ${darkMode
              ? "bg-white/10 border-white/20 hover:shadow-purple-500/20"
              : "bg-white/60 border-white/50 shadow-xl shadow-purple-100"
            }`}>
            <h2 className="text-4xl font-bold text-center mb-8">Add New School</h2>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="School Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full p-4 rounded-2xl outline-none ${darkMode
                    ? "bg-white/15 text-white placeholder-white/60"
                    : "bg-white/70 text-gray-900 border border-purple-100"
                  }`}
              />

              <input
                type="text"
                placeholder="Latitude"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                className={`w-full p-4 rounded-2xl outline-none ${darkMode
                    ? "bg-white/15 text-white placeholder-white/60"
                    : "bg-white/70 text-gray-900 border border-purple-100"
                  }`}
              />

              <input
                type="text"
                placeholder="Longitude"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                className={`w-full p-4 rounded-2xl outline-none ${darkMode
                    ? "bg-white/15 text-white placeholder-white/60"
                    : "bg-white/70 text-gray-900 border border-purple-100"
                  }`}
              />

              <button
                onClick={addSchool}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 font-semibold text-xl hover:shadow-lg"
              >
                Add School
              </button>
            </div>
          </div>

          <div className={`backdrop-blur-3xl rounded-3xl shadow-2xl p-8 border ${darkMode
              ? "bg-white/10 border-white/20"
              : "bg-white/60 border-white/50 shadow-xl shadow-purple-100"
            }`}>
            <h2 className="text-4xl font-bold text-center mb-4">Saved Schools</h2>

            <input
              type="text"
              placeholder="Search school..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full p-4 rounded-2xl mb-6 outline-none ${darkMode
                  ? "bg-white/15 text-white placeholder-white/60"
                  : "bg-white/70 text-gray-900 border border-purple-100"
                }`}
            />

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
              {filteredSchools.map((school) => (
                <div
                  key={school.id}
                  className={`rounded-2xl p-5 ${nearestSchool?.id === school.id
                      ? "bg-yellow-400/20 border border-yellow-300"
                      : darkMode
                        ? "bg-white/10 hover:bg-white/20"
                        : "bg-white/70 shadow-md border border-white/40"
                    }`}
                >
                  <h3 className="text-2xl font-bold">{school.name}</h3>
                  <p className="mt-2">Latitude: {school.latitude}</p>
                  <p>Longitude: {school.longitude}</p>

                  <div className="flex gap-3 mt-4 flex-wrap">
                    <button
                      onClick={() => editSchool(school)}
                      className="px-4 py-2 bg-blue-500/40 rounded-full"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteSchool(school.id)}
                      className="px-4 py-2 bg-red-500/40 rounded-full"
                    >
                      Delete
                    </button>

                    <a
                      href={`https://www.google.com/maps?q=${school.latitude},${school.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-500/40 rounded-full"
                    >
                      📍 View Map
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {editingSchool && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-[400px] shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
                Edit School
              </h2>

              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full p-4 rounded-2xl border border-purple-200 outline-none mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={saveEdit}
                  className="flex-1 py-3 rounded-2xl bg-purple-500 text-white"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingSchool(null)}
                  className="flex-1 py-3 rounded-2xl bg-gray-200 text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;