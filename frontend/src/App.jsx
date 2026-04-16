import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const API = "https://school-location-management-system.onrender.com";

  const [schools, setSchools] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${API}/api/listSchools`);
      setSchools(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const addSchool = async () => {
    if (!form.name || !form.address || !form.latitude || !form.longitude) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(`${API}/api/addSchool`, form);

      setForm({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
      });

      fetchSchools();
    } catch (error) {
      console.log(error);
      alert("Failed to add school");
    }
  };

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen px-6 py-8 ${darkMode ? "bg-gradient-to-br from-purple-950 via-violet-800 to-indigo-900 text-white" : "bg-white text-black"}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8">School Location Dashboard</h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-full bg-white/20"
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-center mb-6">Add New School</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="School Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white/15 outline-none"
              />

              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white/15 outline-none"
              />

              <input
                type="text"
                placeholder="Latitude"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white/15 outline-none"
              />

              <input
                type="text"
                placeholder="Longitude"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white/15 outline-none"
              />

              <button
                onClick={addSchool}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 font-semibold"
              >
                Add School
              </button>
            </div>
          </div>

          <div className="bg-white/10 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-center mb-6">Saved Schools</h2>

            <input
              type="text"
              placeholder="Search school..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/15 outline-none mb-6"
            />

            <div className="space-y-4">
              {filteredSchools.map((school) => (
                <div key={school.id} className="bg-white/10 rounded-2xl p-4">
                  <h3 className="text-xl font-bold">{school.name}</h3>
                  <p>Address: {school.address}</p>
                  <p>Latitude: {school.latitude}</p>
                  <p>Longitude: {school.longitude}</p>

                  <a
                    href={`https://www.google.com/maps?q=${school.latitude},${school.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 px-4 py-2 rounded-xl bg-emerald-500/40"
                  >
                    📍 View Map
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;