import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import './index.css'
import L from "leaflet";

// ✅ FIX LEAFLET ICONS
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
     <CartProvider>
<GoogleOAuthProvider clientId="197117436950-t6e6acoeo1fifh6009jh8riph2hq8u9u.apps.googleusercontent.com">

    <App />
</GoogleOAuthProvider>
     </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
