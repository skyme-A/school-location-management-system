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
          : "bg-gradient-to-br from-slate-50 via-white to-purple-50 text-slate-900"
      }`}
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full"></div>

      <div className="relative flex min-h-screen">

        {/* Sidebar */}
        <aside className="w-72 p-8 border-r border-white/10 bg-white/5 backdrop-blur-xl">

          <h1 className="text-3xl font-black mb-10">🏫 SchoolOS</h1>

          <div className="space-y-5">

            <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-2xl">
              <p className="opacity-80">Total Schools</p>
              <h2 className="text-4xl font-bold">{schools.length}</h2>
            </div>

            <div className="p-5 rounded-3xl bg-white/10">
              <p className="mb-3 opacity-70">Search Schools</p>

              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white/10 border border-white/10 outline-none"
              />
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full py-4 rounded-3xl bg-white/10 hover:bg-white/20 transition"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-10">

          <div className="mb-10">
            <h2 className="text-5xl font-black">School Dashboard</h2>
            <p className={`${darkMode ? "text-slate-300" : "text-slate-500"} mt-2 text-lg`}>
              Premium school location manager
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">

            {/* Add School */}
            <div className="rounded-3xl p-8 bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">

              <h3 className="text-2xl font-bold mb-6">Add New School</h3>

              <div className="space-y-4">

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
                    className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none"
                  />
                ))}

                <button
                  onClick={addSchool}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold"
                >
                  Add School
                </button>
              </div>
            </div>

            {/* Saved Schools */}
            <div className="rounded-3xl p-8 bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">

              <h3 className="text-2xl font-bold mb-6">Saved Schools</h3>

              <div className="space-y-5 max-h-[650px] overflow-y-auto pr-2">

                {filteredSchools.map((school) => (
                  <div
                    key={school.id}
                    className="p-5 rounded-3xl bg-white/10 border border-white/10"
                  >
                    <h4 className="text-lg font-bold">{school.name}</h4>
                    <p className="opacity-70 mt-1">{school.address}</p>

                    <div className="mt-3 text-sm opacity-60">
                      Lat: {school.latitude} | Lng: {school.longitude}
                    </div>

                    <iframe
                      title={school.name}
                      className="w-full h-48 rounded-2xl mt-4"
                      src={`https://www.google.com/maps?q=${school.latitude},${school.longitude}&output=embed`}
                    ></iframe>

                    <button
                      onClick={() => deleteSchool(school.id)}
                      className="mt-4 px-4 py-2 rounded-xl bg-red-500/20 text-red-300"
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
