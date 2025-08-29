import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppStore } from "./store";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Note from "./pages/Note";
import NewNotes from "./pages/NewNotes";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth/sign-in" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/" /> : children;
};

const App = () => {
  const { getUserInfo, userInfo } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await getUserInfo();
      setIsLoading(false);
    };
    checkAuth();
  }, [getUserInfo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      </div>

      <main className="relative flex items-center justify-center min-h-screen p-6">
        <div className={`w-full ${userInfo===undefined&&'max-w-md'}`}>
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <BrowserRouter>
              <Routes>
                <Route
                  path="/auth/sign-up"
                  element={
                    <AuthRoute>
                      <Register />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/auth/sign-in"
                  element={
                    <AuthRoute>
                      <Login />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/auth/forgot-password"
                  element={
                    <AuthRoute>
                      <ForgotPassword />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/auth/verify-otp"
                  element={
                    <AuthRoute>
                      <VerifyOTP />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/auth/reset-password"
                  element={
                    <AuthRoute>
                      <ResetPassword />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/notes/:id"
                  element={
                    <PrivateRoute>
                      <Note />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/notes/new"
                  element={
                    <PrivateRoute>
                      <NewNotes />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/auth/sign-in" />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
