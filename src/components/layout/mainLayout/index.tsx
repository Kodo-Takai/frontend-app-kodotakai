import { Outlet } from "react-router-dom";
import { BottomNav, defaultItems } from "../BottomNav";

const MainLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-gray-100 p-4">
                <Outlet />
            </main>
            <BottomNav items={defaultItems} />   
        </div>
    );
};

export default MainLayout;