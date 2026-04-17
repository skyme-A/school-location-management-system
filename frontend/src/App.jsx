import { useEffect, useMemo, useState } from "react";

export default function App() {
  const API = "https://school-location-management-system.onrender.com/api";

  const [schools, setSchools] = useState([]);
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

  const filteredSchools = useMemo(() => {
    return schools.filter((school) =>
      (school.name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [schools, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200 p-8 shadow-sm">

          <h1 className="text-3xl font-semibold text-slate-900 mb-10">
            🏫 SchoolOS
          </h1>

          <div className="space-y-5">

            <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-lg">
              <p className="text-sm opacity-70">Total Schools</p>
              <h2 className="text-4xl font-bold mt-2">{schools.length}</h2>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">Search Schools</p>

              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-3 w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none"
              />
            </div>

          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-10">

          <div className="mb-10">
            <h2 className="text-5xl font-semibold text-slate-900 tracking-tight">
              School Dashboard
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              Premium school location manager
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">

            {/* Add School */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 p-8">

              <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                Add New School
              </h3>

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
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                ))}

                <button
                  onClick={addSchool}
                  className="w-full py-4 rounded-2xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
                >
                  Add School
                </button>
              </div>
            </div>

            {/* School List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 p-8">

              <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                Saved Schools
              </h3>

              <div className="space-y-5 max-h-[650px] overflow-y-auto pr-2">

                {filteredSchools.map((school) => (
                  <div
                    key={school.id}
                    className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-md transition"
                  >
                    <h4 className="text-lg font-semibold text-slate-900">
                      {school.name}
                    </h4>

                    <p className="text-slate-500 mt-1">{school.address}</p>

                    <div className="mt-3 text-sm text-slate-400">
                      Lat: {school.latitude} | Lng: {school.longitude}
                    </div>

                    <iframe
                      title={school.name}
                      className="w-full h-52 rounded-2xl mt-4 border"
                      src={`https://www.google.com/maps?q=${school.latitude},${school.longitude}&output=embed`}
                    />
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
