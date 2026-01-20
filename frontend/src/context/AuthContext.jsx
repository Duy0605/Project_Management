import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            setLoading(false);
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        try {
            const response = await axiosInstance.get("/users/me");

            setUser(response.data.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("kiểm tra xác thực thất bại:", error);
            localStorage.removeItem("accessToken");
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post("/auth/login", {
                email,
                password,
            });

            const { accessToken, user } = response.data.data;

            localStorage.setItem("accessToken", accessToken);
            setUser(user);
            setIsAuthenticated(true);

            return {
                success: true,
                message: response.data.message || "Đăng nhập thành công.",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Đăng nhập thất bại. Vui lòng thử lại.",
            };
        }
    };

    const register = async (name, email, password, confirmPassword) => {
        try {
            const response = await axiosInstance.post("/auth/register", {
                name,
                email,
                password,
                confirmPassword,
            });

            const { accessToken, user } = response.data.data;

            console.log("📝 Đăng ký thành công - User data:", user);
            console.log("🎨 Avatar color:", user.avatarColor);

            localStorage.setItem("accessToken", accessToken);
            setUser(user);
            setIsAuthenticated(true);

            return {
                success: true,
                message: response.data.message || "Đăng ký thành công.",
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Đăng ký thất bại. Vui lòng thử lại.",
            };
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (error) {
            console.error("Đăng xuất thất bại:", error);
        } finally {
            localStorage.removeItem("accessToken");
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (updatedData) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...updatedData,
        }));
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("userAuth phải được sử dụng bên trong AuthProvider");
    }

    return context;
};
