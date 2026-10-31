import { Routes, Route, Navigate } from "react-router-dom";
import { SignUp } from "@/pages/SignUp";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import Cart from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { OrderConfirmation } from "@/pages/OrderConfirmation";
import { OrderHistory } from "@/pages/OrderHistory";
import { Orders } from "@/pages/Orders";
import Shop from "@/pages/Shop";
import { Home } from "@/pages/Home";
import { ProductDetail } from "@/pages/ProductDetail";
import { RequireAuth } from "@/components/auth/require-auth";
import { StoreLayout } from "@/components/store/StoreLayout";

export default function App() {
  return (
    <Routes>
      {/* Auth routes without store layout */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Store routes wrapped in layout */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Navigate to="/shop" replace />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <RequireAuth>
              <OrderConfirmation />
            </RequireAuth>
          }
        />
        <Route
          path="/order-history"
          element={
            <RequireAuth>
              <OrderHistory />
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <Orders />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}