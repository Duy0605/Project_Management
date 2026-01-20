import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
    const location = useLocation();
    const hideSidebar = location.pathname.startsWith("/task/");

    return (
        <div className="flex flex-col h-screen bg-slate-900">
            <div className="shrink-0">
                <Navbar />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {!hideSidebar && <Sidebar />}

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
