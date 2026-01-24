import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// interceptor để tự động thêm token vào header của mỗi request
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);
// interceptor để xử lý response và lỗi từ server
axiosInstance.interceptors.response.use(
    // Nếu response thành công, chỉ cần trả về response
    (response) => {
        return response;
    },
    // Nếu có lỗi, kiểm tra nếu là lỗi xác thực (401) thì thử làm mới token
    async (error) => {
        const originalRequest = error.config;

        const isAuthRoute =
            originalRequest.url.includes("/auth/login") ||
            originalRequest.url.includes("/auth/register") ||
            originalRequest.url.includes("/auth/forgot-password") ||
            originalRequest.url.includes("/auth/reset-password");

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthRoute
        ) {
            originalRequest._retry = true;
            // Làm mới token
            try {
                const response = await axios.post(
                    `${
                        import.meta.env.VITE_API_URL ||
                        "http://localhost:5000/api"
                    }/auth/refresh-token`,
                    {},
                    { withCredentials: true },
                );
                // Lưu lại token mới và cập nhật header của request gốc
                const { accessToken } = response.data.data;
                localStorage.setItem("accessToken", accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Nếu làm mới token thất bại, chuyển hướng về trang đăng nhập
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
