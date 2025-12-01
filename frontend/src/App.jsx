import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
// import AdminDashboard from "./pages/admin/AdminDashboard";
import Cart from "./pages/Cart";

import AllCategoriesPage from "./pages/AllCategoriesPage";
import ProductDetails from "./pages/ProductDetails";
import Address from "./pages/Address";
import OrderConfirmation from "./pages/OrderConfirmation";
import Payment from "./pages/Payment";
import Orders from "./pages/admin/pages/Orders";
import Customers from "./pages/admin/pages/Customers";
import Analytics from "./pages/admin/pages/Analytics";
import Dashboard from "./pages/admin/pages/Dashboard";
import Products from "./pages/admin/pages/AdminProducts";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyOrders from "./pages/MyOrders";


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
              <ProtectedRoute adminOnly={true}>
                {/* <AdminDashboard /> */}
                
                <Dashboard/>
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/myorders" element={<MyOrders/>} />
          
           <Route path="/address" element={<Address />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/all-categories" element={<AllCategoriesPage />} />
          
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/products" element={<Products
                     />} />
                     <Route path="/payment-success" element={<PaymentSuccess />} />

                    <Route path="/analytics" element={<Analytics />} />
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
