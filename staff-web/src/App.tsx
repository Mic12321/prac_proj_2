import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StockManagement from "./pages/StockManagement";
import Analysis from "./pages/Analysis";
import AccountManagement from "./pages/AccountManagement";
import PendingOrders from "./pages/PendingOrders";
import Order from "./pages/Order";
import SearchItem from "./pages/SearchItem";
import AddItem from "./pages/AddItem";
import Checkout from "./pages/Checkout";
import ItemDetail from "./pages/ItemDetail";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";
import IngredientManagement from "./pages/IngredientManagement";
import IngredientUsedIn from "./pages/IngredientUsedIn";
import CategoryManagement from "./pages/CategoryManagement";
import CategoryDetail from "./pages/CategoryDetail";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import PickedOrders from "./pages/PickedOrders";
import Unauthorized from "./pages/Unauthorized";

import { AuthProvider, useAuth } from "./context/AuthContext";

const AppRoutes = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [navbarHeight, setNavbarHeight] = useState(0);

  return (
    <>
      {isAuthenticated && user && <Navbar setNavbarHeight={setNavbarHeight} />}

      <div
        className="container mt-4"
        style={{ paddingTop: `${navbarHeight}px` }}
      >
        <Routes>
          <Route path="/" element={<ProtectedRoute children={<Home />} />} />
          <Route
            path="/home"
            element={<ProtectedRoute children={<Home />} />}
          />
          <Route path="/login" element={<Login />} />

          <Route
            path="/account-management"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                children={<AccountManagement />}
              />
            }
          />

          <Route
            path="/staff/orders"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
                children={<PendingOrders />}
              />
            }
          />

          <Route
            path="/stock-management"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
                children={<StockManagement />}
              />
            }
          />

          <Route
            path="/analysis"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                children={<Analysis />}
              />
            }
          />

          <Route
            path="/order"
            element={<ProtectedRoute children={<Order />} />}
          />

          <Route
            path="/pending-orders"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
                children={<PendingOrders />}
              />
            }
          />

          <Route
            path="/search-item"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
                children={<SearchItem />}
              />
            }
          />

          <Route
            path="/add-item"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
                children={<AddItem />}
              />
            }
          />

          <Route
            path="/item-detail/:itemId"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
                children={<ItemDetail />}
              />
            }
          />

          <Route
            path="/checkout"
            element={<ProtectedRoute children={<Checkout />} />}
          />

          <Route
            path="/item/:itemId/ingredients"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
                children={<IngredientManagement />}
              />
            }
          />

          <Route
            path="/ingredient/:ingredientId"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
                children={<IngredientUsedIn />}
              />
            }
          />

          <Route
            path="/category-management"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                children={<CategoryManagement />}
              />
            }
          />

          <Route
            path="/category-detail/:categoryId"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                children={<CategoryDetail />}
              />
            }
          />

          <Route
            path="/order-history"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
                children={<OrderHistory />}
              />
            }
          />

          <Route
            path="/order-detail/:orderId"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
                children={<OrderDetail />}
              />
            }
          />

          <Route
            path="/staff/picked-orders"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "staff"]}
                children={<PickedOrders />}
              />
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
