// src/pages/Patients.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function Patients() {
  const [query, setQuery] = useState("");

  const patients = [
    {
      id: 1,
      name: "田中 美咲",
      kana: "タナカ ミサキ",
      age: 34,
      lastVisit: "2026-07-05",
      visits: 24,
    },
    {
      id: 2,
      name: "鈴木 健太",
      kana: "スズキ ケンタ",
      age: 45,
      lastVisit: "2026-07-08",
      visits: 12,
    },
    {
      id: 3,
      name: "伊藤 さくら",
      kana: "イトウ サクラ",
      age: 28,
      lastVisit: "2026-07-09",
      visits: 8,
    },
    {
      id: 4,
      name: "渡辺 浩二",
      kana: "ワタナベ コウジ",
      age: 58,
      lastVisit: "2026-07-01",
      visits: 36,
    },
  ];

  const filtered = patients.filter((p) => {
    const q = query.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.kana.toLowerCase().includes(q);
  });

  return (
    <div className="p-8 bg-[#f5efe3] min-h-screen text-[#1f3b33]">
      {/* タイトル部分 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-600">患者データベース</p>
          <h1 className="text-3xl font-bold">患者一覧</h1>
        </div>

        <Link
          to="/patients/new"
          className="bg-[#1f3b33] text-white px-5 py-2 rounded-md hover:bg-[#2a4a40] transition"
        >
          ＋ 新規患者登録
        </Link>
      </div>

      {/* 検索バー */}
      <div className="flex items-center bg-[#e8dfd0] rounded-md p-3 mb-6">
        <FiSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="名前・カナで検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
        />
      </div>

      {/* テーブル */}
      <div className="bg-[#f5efe3] rounded-lg shadow-sm border border-[#e0d6c5]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#e0d6c5] text-gray-700">
              <th className="p-3 font-medium">患者名</th>
              <th className="p-3 font-medium">年齢</th>
              <th className="p-3 font-medium">最終来院</th>
              <th className="p-3 font-medium">施術回数</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-[#e0d6c5] hover:bg-[#e8dfd0] transition"
              >
                <td className="p-3">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-600">{p.kana}</div>
                </td>
                <td className="p-3">{p.age}歳</td>
                <td className="p-3">{p.lastVisit}</td>
                <td className="p-3 font-bold text-[#1f3b33]">{p.visits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
