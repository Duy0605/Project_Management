import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import BoardPage from "./pages/BoardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PersonalBoardPage from "./pages/PersonalBoardPage";
import MemberPage from "./pages/MemberPage";
import TaskPage from "./pages/TaskPage";
import ProfilePage from "./pages/ProfilePage";
import RecentActivities from "./pages/RecentActivities";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

import "./index.css";

function App() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                    <p className="mt-4 font-medium text-gray-600">
                        Đang tải...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            {/*Trang mặc định */}
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Navigate to="/home" replace />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
            {/*Các trang auth */}
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/home" replace />
                    ) : (
                        <LoginPage />
                    )
                }
            />
            <Route
                path="/register"
                element={
                    isAuthenticated ? (
                        <Navigate to="/home" replace />
                    ) : (
                        <RegisterPage />
                    )
                }
            />
            <Route
                path="/forgot-password"
                element={
                    isAuthenticated ? (
                        <Navigate to="/home" replace />
                    ) : (
                        <ForgotPasswordPage />
                    )
                }
            />
            <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
            />
            {/* Các trang chính */}
            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route path="/home" element={<HomePage />} />
                <Route path="/board" element={<BoardPage />} />
                <Route path="/task/:boardId" element={<TaskPage />} />
                <Route
                    path="/personal-boards"
                    element={<PersonalBoardPage />}
                />
                <Route path="/members" element={<MemberPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/activities" element={<RecentActivities />} />
                <Route path="/change-password" element={<ChangePasswordPage />} />
            </Route>

            {/* lỗi route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
