import { useEffect, useMemo, useState } from "react";

export default function App() {
  const API = "https://school-location-management-system.onrender.com/api";

  const [schools, setSchools] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const fetchSchools = async () => {
    try {
      const res = await fetch(`${API}/listSchools`);
      const data = await res.json();
      setSchools(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const addSchool = async () => {
    if (!form.name || !form.address || !form.latitude || !form.longitude) return;

    try {
      await fetch(`${API}/addSchool`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      setForm({
        name: "",
        address: "",
        latitude: "",
        longitude: ""
      });

      fetchSchools();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteSchool = async (id) => {
    try {
      await fetch(`${API}/deleteSchool/${id}`, {
        method: "DELETE"
      });

      fetchSchools();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredSchools = useMemo(() => {
    return schools.filter((school) =>
      (school.name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [schools, search]);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-[#160024] via-[#2d0050] to-[#3b0080] text-white"
          : "bg-gradient-to-br from-[#f8f7ff] via-[#ffffff] to-[#eef2ff] text-slate-900"
      }`}
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/15 blur-3xl rounded-full"></div>

      <div className="relative flex min-h-screen">

        {/* Sidebar */}
        <aside
          className={`w-72 px-8 pt-16 pb-8 border-r backdrop-blur-xl ${
            darkMode
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-white/60"
          }`}
        >
          <h1 className="text-3xl font-black mb-10 tracking-tight bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            🏫 SchoolOS Pro
          </h1>

          <div className="space-y-6">

            <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <p className="opacity-80">Total Schools</p>
              <h2 className="text-4xl font-bold">{schools.length}</h2>
            </div>

            <div
              className={`p-5 rounded-3xl hover:-translate-y-1 transition-all duration-300 ${
                darkMode ? "bg-white/10" : "bg-white/70 shadow"
              }`}
            >
              <p className="mb-3 opacity-70">Search Schools</p>

              <input
                placeholder="Search by school name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full p-3 rounded-2xl border outline-none focus:ring-2 focus:ring-purple-500/40 transition-all duration-300 ${
                  darkMode
                    ? "bg-white/10 border-white/10"
                    : "bg-white text-slate-900 border-slate-200"
                }`}
              />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-12 pt-10 pb-10 max-w-[1400px] mx-auto w-full">

          {/* Header */}
          <div className="mb-10 flex justify-between items-start">
            <div>
              <h2 className="text-6xl font-black tracking-tight leading-tight">
                School Dashboard
              </h2>

              <p className={`${darkMode ? "text-slate-300" : "text-slate-500"} text-xl mt-3 opacity-80`}>
                Premium school location manager
              </p>

              <div
                className={`inline-block mt-4 px-3 py-1.5 rounded-full text-sm font-medium ${
                  darkMode ? "bg-white/10" : "bg-white shadow"
                }`}
              >
                {schools.length} Active Schools
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-5 py-3 rounded-2xl backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-105 ${
                darkMode
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-white/80 text-slate-900 hover:bg-white"
              }`}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          {/* Grid */}
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 items-start">

            {/* Add School */}
            <div
              className={`rounded-3xl p-8 min-h-[540px] hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.18)] ${
                darkMode
                  ? "bg-white/8 backdrop-blur-2xl border border-white/10"
                  : "bg-white/80 border border-slate-200"
              }`}
            >
              <h3 className="text-2xl font-bold mb-6">Add New School</h3>

              <div className="space-y-5 mt-6">

                {["name", "address", "latitude", "longitude"].map((field) => (
                  <input
                    key={field}
                    placeholder={field}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [field]: e.target.value
                      })
                    }
                    className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-purple-500/40 transition-all duration-300 ${
                      darkMode
                        ? "bg-white/10 border-white/10"
                        : "bg-white text-slate-900 border-slate-200"
                    }`}
                  />
                ))}

                <button
                  onClick={addSchool}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99] transition-all duration-300"
                >
                  Add School
                </button>
              </div>
            </div>

            {/* Saved Schools */}
            <div
              className={`rounded-3xl p-8 min-h-[540px] hover:-translate-y-1 transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.18)] ${
                darkMode
                  ? "bg-white/8 backdrop-blur-2xl border border-white/10"
                  : "bg-white/80 border border-slate-200"
              }`}
            >
              <h3 className="text-2xl font-bold mb-6">Saved Schools</h3>

              <div className="space-y-5 max-h-[440px] overflow-y-auto pr-2">

                {filteredSchools.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-[360px] opacity-50">
                    <div className="text-5xl mb-3">📍</div>
                    <div className="text-lg">No schools added yet</div>
                  </div>
                )}

                {filteredSchools.map((school) => (
                  <div
                    key={school.id}
                    className={`p-5 rounded-3xl hover:scale-[1.02] transition-all duration-300 ${
                      darkMode
                        ? "bg-white/10 border border-white/10"
                        : "bg-white shadow border border-slate-200"
                    }`}
                  >
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold">{school.name}</h4>
                      <p className="opacity-70">{school.address}</p>
                      <div className="text-sm opacity-60">
                        Lat: {school.latitude} | Lng: {school.longitude}
                      </div>
                    </div>

                    <iframe
                      title={school.name}
                      className="w-full h-48 rounded-2xl mt-4"
                      src={`https://www.google.com/maps?q=${school.latitude},${school.longitude}&output=embed`}
                    ></iframe>

                    <button
                      onClick={() => deleteSchool(school.id)}
                      className="mt-4 px-4 py-2 rounded-xl bg-red-500/20 text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
       