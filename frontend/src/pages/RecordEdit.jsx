// src/pages/RecordEdit.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { records } from "../data/records";

export default function RecordEdit() {
  const { customerId, recordId } = useParams();
  const navigate = useNavigate();

  // 該当レコードを取得
  const record = records.find(
    (r) => r.id === Number(recordId) && r.customerId === Number(customerId),
  );

  // 初期値（見つからない場合は空）
  const [form, setForm] = useState(
    record || {
      date: "",
      startTime: "",
      menu: "",
      part: "",
      memo: "",
    },
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 仮更新（バックエンド接続後は PUT / PATCH に変更）
    const index = records.findIndex((r) => r.id === Number(recordId));
    if (index !== -1) {
      records[index] = { ...records[index], ...form };
    }

    alert("施術記録を更新しました！（仮）");
    navigate(`/customers/${customerId}/records/${recordId}`);
  };

  if (!record) {
    return (
      <div className="p-6">
        <p className="text-gray-600">施術記録が見つかりません。</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-6">施術記録 編集</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded space-y-4"
      >
        {/* 施術日 */}
        <div>
          <label className="block mb-1 font-medium">施術日</label>
          <input
            type="text"
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="例：2026-08-06"
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {/* 開始時刻 */}
        <div>
          <label className="block mb-1 font-medium">開始時刻</label>
          <input
            type="text"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            placeholder="例：14:30"
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {/* メニュー */}
        <div>
          <label className="block mb-1 font-medium">施術メニュー</label>
          <input
            type="text"
            name="menu"
            value={form.menu}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {/* 施術部位 */}
        <div>
          <label className="block mb-1 font-medium">施術部位</label>
          <input
            type="text"
            name="part"
            value={form.part}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* メモ */}
        <div>
          <label className="block mb-1 font-medium">メモ</label>
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            rows="3"
            className="border p-2 w-full rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          更新する
        </button>
      </form>
    </div>
  );
}
