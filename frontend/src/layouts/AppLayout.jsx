// src/layouts/AppLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className="flex">
      {/* 左サイドバー */}
      <Sidebar />

      {/* メインコンテンツ（横幅を最大化） */}
      <main className="flex-1 ml-48 p-6 bg-gray-50 w-full">
        <Outlet />
      </main>
    </div>
  );
}
