// src/pages/CustomerNew.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    memo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ★ バックエンド API に送信（本物の登録）
      const res = await fetch("http://localhost:3001/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert("登録に失敗しました");
        return;
      }

      const data = await res.json();

      console.log("★★★ 登録された顧客 ★★★", data);

      alert("顧客を登録しました！");
      navigate("/customers");
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">新規顧客登録</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded">
        <div className="grid grid-cols-2 gap-8">
          {/* 左側：基本情報 */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-bold">名前</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-bold">電話番号</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold">メール</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          {/* 右側：メモ欄 */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-bold">メモ</label>
              <textarea
                name="memo"
                value={form.memo}
                onChange={handleChange}
                className="border p-2 rounded w-full h-[200px]"
              ></textarea>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          登録する
        </button>
      </form>
    </div>
  );
}
