import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";

import AllCategoriesPage from "./pages/AllCategoriesPage";
import ProductDetails from "./pages/ProductDetails";
import Address from "./pages/Address";
import OrderConfirmation from "./pages/OrderConfirmation";
import Payment from "./pages/Payment";

// ✅ This component can safely use useLocation()
function Layout() {
 

  return (
    <>
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<Cart />} />
           <Route path="/address" element={<Address />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/all-categories" element={<AllCategoriesPage />} />
        </Routes>
      </main>
     
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
