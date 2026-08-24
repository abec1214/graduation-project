// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-screen w-48 bg-[#1f3b33] text-white flex flex-col justify-between">
      {/* ヘッダー */}
      <div className="px-6 pt-10 pb-6">
        <p className="text-xs tracking-wide mb-2">MASSAGE EMR</p>
        <h1 className="text-2xl font-bold mb-1">Karada</h1>
        <p className="text-sm text-[#d4a373]">カルテ</p>
      </div>

      {/* ナビゲーション */}
      <nav className="mt-2 space-y-3">
        {/* ダッシュボード */}
        <Link
          to="/dashboard"
          className={`flex items-center px-6 py-4 rounded-r-full hover:bg-[#2a4a40] transition ${
            location.pathname === "/dashboard" ? "bg-[#2a4a40]" : ""
          }`}
        >
          <span className="mr-4 text-lg">📊</span>
          <span className="text-sm">ダッシュボード</span>
        </Link>

        {/* 顧客検索 */}
        <Link
          to="/customers"
          className={`flex items-center px-6 py-4 rounded-r-full hover:bg-[#2a4a40] transition ${
            location.pathname.startsWith("/customers") ? "bg-[#2a4a40]" : ""
          }`}
        >
          <span className="mr-4 text-lg">👥</span>
          <span className="text-sm">顧客検索</span>
        </Link>

        {/* 予約管理 */}
        <Link
          to="/reservations"
          onClick={() => {
            if (location.pathname === "/reservations") {
              window.location.reload();
            }
          }}
          className={`flex items-center px-6 py-4 rounded-r-full hover:bg-[#2a4a40] transition ${
            location.pathname.includes("reservations") ||
            location.pathname.includes("patients") ||
            location.pathname.includes("visits")
              ? "bg-[#2a4a40]"
              : ""
          }`}
        >
          <span className="mr-4 text-lg">📅</span>
          <span className="text-sm">予約管理</span>
        </Link>
      </nav>

      {/* フッター */}
      <div className="p-6 border-t border-[#2a4a40]">
        <div className="flex items-center space-x-3"></div>
      </div>
    </div>
  );
}
