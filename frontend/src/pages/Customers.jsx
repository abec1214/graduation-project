import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

export default function Customers() {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState([]);

  // MySQL から顧客一覧を取得
  useEffect(() => {
    fetch(`${API_URL}/api/customers`)
      .then((res) => res.json())
      .then((data) => {
        console.log("★★★ APIから取得した顧客一覧 ★★★", data);
        setCustomers(data);
      })
      .catch((err) => {
        console.error("顧客一覧の取得に失敗:", err);
      });
  }, []);

  // 顧客削除
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `「${name}」を削除しますか？\nこの操作は元に戻せません。`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/customers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("顧客の削除に失敗しました");
      }

      // 画面からも削除
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));

      console.log("顧客を削除しました:", id);
    } catch (err) {
      console.error("顧客削除エラー:", err);
      alert("顧客の削除に失敗しました");
    }
  };

  const filtered = customers.filter((c) => {
    const q = query.toLowerCase();

    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(query) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 bg-[#f5efe3] min-h-screen text-[#1f3b33]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">顧客検索</h2>

        <Link
          to="/customers/new"
          className="bg-[#1f3b33] text-white px-4 py-2 rounded hover:bg-[#2a4a40]"
        >
          ＋ 新規顧客登録
        </Link>
      </div>

      <div className="flex items-center bg-[#e8dfd0] rounded-md p-3 mb-6 border border-[#d8cbb8]">
        <input
          type="text"
          placeholder="名前・電話番号・メールで検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
        />
      </div>

      <div className="bg-[#f5efe3] rounded-lg shadow-sm border border-[#d8cbb8]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#d8cbb8] text-gray-700">
              <th className="p-3 font-medium">名前</th>
              <th className="p-3 font-medium">電話番号</th>
              <th className="p-3 font-medium">メール</th>
              <th className="p-3 font-medium">詳細</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[#d8cbb8] hover:bg-[#e8dfd0] transition"
              >
                <td className="p-3">
                  <div>{c.name}</div>
                  <div className="text-sm text-gray-500">{c.kana}</div>
                </td>

                <td className="p-3">{c.phone}</td>

                <td className="p-3">{c.email}</td>

                <td className="p-3">
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/customers/${c.id}`}
                      className="text-[#1f3b33] hover:text-[#4f8f6b] underline font-medium"
                    >
                      詳細を見る
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(c.id, c.name)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
