import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import './index.css'
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
