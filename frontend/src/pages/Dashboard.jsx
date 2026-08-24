// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    reservations: 0,
    newCustomers: 0,
  });

  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // MySQLからダッシュボード情報を取得
  useEffect(() => {
    fetch(`${API_URL}/api/dashboard`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("ダッシュボード情報の取得に失敗しました");
        }

        return res.json();
      })
      .then((data) => {
        console.log("★★★ ダッシュボード情報 ★★★", data);

        // 統計カード
        setStats({
          reservations: Number(data.stats?.reservations || 0),
          newCustomers: Number(data.stats?.newCustomers || 0),
        });

        // 最近の予約
        setRecentReservations(data.recentReservations || []);
      })
      .catch((err) => {
        console.error("ダッシュボード情報の取得に失敗:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      label: "今月の予約数",
      value: stats.reservations,
      icon: "📅",
      color: "bg-[#d4a373]",
    },

    {
      label: "新規顧客",
      value: stats.newCustomers,
      icon: "🩺",
      color: "bg-[#c3f5d4]",
    },
  ];

  return (
    <div className="p-8 bg-[#f9f5ee] min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-[#1f3b33] mb-6">ダッシュボード</h1>

      {/* ============================
    統計カード
============================ */}
      <div className="flex justify-center gap-5 mb-10">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={`w-full max-w-xs p-4 rounded-xl shadow-md hover:shadow-lg transition text-center ${s.color}`}
          >
            <div className="text-3xl mb-1">{s.icon}</div>

            <p className="text-sm text-gray-700">{s.label}</p>

            <p className="text-2xl font-bold text-[#1f3b33]">
              {loading ? "..." : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ============================
          最近の予約
      ============================ */}
      <h2 className="text-lg font-semibold text-[#1f3b33] mb-4">最近の予約</h2>

      <div className="space-y-3">
        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            予約情報を読み込んでいます...
          </div>
        ) : recentReservations.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            予約はありません
          </div>
        ) : (
          recentReservations.map((r) => (
            <div
              key={r.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center hover:bg-[#e8dfd0] transition"
            >
              <Link
                to={`/customers/${r.customerId}`}
                className="text-black font-semibold hover:underline"
              >
                {r.name || "顧客名なし"}
                {r.type ? `（${r.type}）` : ""}
              </Link>

              <span className="text-gray-500">
                {r.date ? new Date(r.date).toLocaleDateString("ja-JP") : ""}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
