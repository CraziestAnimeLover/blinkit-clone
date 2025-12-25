import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import DashView from "./DashView";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products`
    );
    setProducts(res.data.products);
  };

  const fetchUsers = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/users`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/products`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchProducts();
    setForm({ name: "", price: "", category: "", stock: "", image: null });
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onChangePage={setActivePage} />

      {/* Main Content */}
      <main
        className="
          md:ml-64           /* space for sidebar */
          pt-16 md:pt-6      /* space for mobile top bar */
          px-4 md:px-6
          pb-10
        "
      >
        {activePage === "dashboard" && <DashView />}

        {activePage === "products" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Product Management</h1>

            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-3 bg-white p-4 rounded shadow mb-6"
            >
              <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 rounded" />
              <input name="price" placeholder="Price" onChange={handleChange} className="border p-2 rounded" />
              <input name="category" placeholder="Category" onChange={handleChange} className="border p-2 rounded" />
              <input name="stock" placeholder="Stock" onChange={handleChange} className="border p-2 rounded" />
              <input type="file" name="image" onChange={handleChange} className="border p-2 rounded col-span-full" />
              <button className="bg-green-600 text-white py-2 rounded col-span-full">
                Add Product
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p._id} className="bg-white rounded shadow">
                  <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
                  <div className="p-3">
                    <h2 className="font-semibold">{p.name}</h2>
                    <p className="text-gray-600">₹{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activePage === "customers" && (
          <>
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="bg-white rounded shadow">
              {users.map((u) => (
                <div key={u._id} className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      u.isAdmin ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {u.isAdmin ? "Remove Admin" : "Make Admin"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
