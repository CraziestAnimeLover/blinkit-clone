import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from  "./components/Navbar"
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Cart from "./pages/Cart";
import AllCategoriesPage from "./pages/Categories/AllCategoriesPage";
import ProductDetails from "./pages/Product/ProductDetails";
import CategoryPage from "./pages/Categories/CategoryPage";
import Address from "./pages/Address";
import OrderConfirmation from "./pages/Order/OrderConfirmation";
import Payment from "./pages/Payment/Payment";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import MyOrders from "./pages/Order/MyOrders";
import ProfilePage from "./pages/Profile/ProfilePage";
import LoginSuccess from "./pages/Login/LoginSuccess";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";
import RecommendedProducts from "./pages/Product/RecommendedProducts";
import ProtectedRoute from "./components/ProtectedRoute"

// Admin pages
import Orders from "./pages/admin/pages/Orders";
import Customers from "./pages/admin/pages/Customers";
import Analytics from "./pages/admin/pages/Analytics";
import Dashboard from "./pages/admin/pages/Dashboard";
import AdminProducts from "./pages/admin/pages/AdminProducts";
import DeliveryDashboard from "./pages/deliveryman/DeliveryDashboard/DeliveryDashboard";


// ✅ This component can safely use useLocation()
function Layout() {
 

  return (
    <>
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
  <Route path="/login/success" element={<LoginSuccess />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
<Route path="/reset-password/:token" element={<ResetPassword />} />


          <Route path="/profile" element={<ProfilePage />} />

      
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                {/* <AdminDashboard /> */}
                
                <Dashboard/>
              </ProtectedRoute>
            }
          />
  <Route
  path="/delivery/dashboard"
  element={
    <ProtectedRoute deliveryOnly={true}>
      <DeliveryDashboard />
    </ProtectedRoute>
  }
/>


          <Route path="/cart" element={<Cart />} />
          <Route path="/my-orders" element={<MyOrders/>} />
          
           <Route path="/address" element={<Address />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
         <Route path="/myorders" element={<MyOrders/>} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/all-categories" element={<AllCategoriesPage />} />
          <Route path="/category/:categoryTitle" element={<CategoryPage />} />
          
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/recommended" element={<RecommendedProducts />} />

                    <Route path="/customers" element={<Customers />} />
                    <Route path="/products" element={<AdminProducts
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
