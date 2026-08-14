import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { visits } from "../data/visitsData";

export default function VisitEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const visit = visits.find((v) => v.id === Number(id));

  const [form, setForm] = useState({
    date: visit.date,
    type: visit.type,
    duration: visit.duration,
    pressure: visit.pressure,
    memo: visit.memo,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("編集後のデータ:", form);
    alert("施術履歴を更新しました！（仮）");
    navigate(-1);
  };

  // 🟩 削除処理を追加
  const handleDelete = () => {
    if (confirm("この施術履歴を削除しますか？")) {
      // 仮削除（DBがないので配列から削除）
      const index = visits.findIndex((v) => v.id === Number(id));
      if (index !== -1) {
        visits.splice(index, 1);
      }

      alert("施術履歴を削除しました。");
      navigate(-1); // 前のページに戻る
    }
  };

  return (
    <div className="flex-1 bg-[#f9f5ee] p-8 overflow-y-auto font-sans text-[#1f3b33]">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1f3b33]">施術履歴 編集</h1>
        <div className="space-x-2">
          <button
            onClick={handleSubmit}
            className="bg-[#1f3b33] text-white px-4 py-2 rounded hover:bg-[#2a4a3f]"
          >
            保存
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-[#1f3b33] px-4 py-2 rounded hover:bg-gray-300"
          >
            キャンセル
          </button>
        </div>
      </div>

      {/* フォーム */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow text-[#1f3b33]"
      >
        {/* 施術日（手入力可能） */}
        <div>
          <label className="block mb-2 font-semibold">施術日</label>
          <input
            type="text"
            name="date"
            placeholder="例：2026-07-05"
            value={form.date}
            onChange={handleChange}
            className="border rounded w-full p-3 text-[#1f3b33] placeholder-gray-400 bg-white"
          />
        </div>

        {/* 施術タイプ */}
        <div>
          <label className="block mb-2 font-semibold">施術タイプ</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded w-full p-3 text-[#1f3b33] bg-white"
          >
            <option value="スウェーデン">スウェーデン</option>
            <option value="ディープティッシュ">ディープティッシュ</option>
            <option value="アロマ">アロマ</option>
            <option value="スポーツ">スポーツ</option>
          </select>
        </div>

        {/* 施術時間（手入力可能） */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold">施術時間（分）</label>
            <input
              type="text"
              name="duration"
              placeholder="例：60"
              value={form.duration}
              onChange={handleChange}
              className="border rounded w-full p-3 text-[#1f3b33] placeholder-gray-400 bg-white"
            />
          </div>

          {/* 圧の強度 */}
          <div>
            <label className="block mb-2 font-semibold">圧の強度</label>
            <select
              name="pressure"
              value={form.pressure}
              onChange={handleChange}
              className="border rounded w-full p-3 text-[#1f3b33] bg-white"
            >
              <option value="軽">軽</option>
              <option value="中">中</option>
              <option value="強">強</option>
            </select>
          </div>
        </div>

        {/* メモ */}
        <div>
          <label className="block mb-2 font-semibold">メモ</label>
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            className="border rounded w-full p-3 h-32 text-[#1f3b33] bg-white placeholder-gray-400"
          />
        </div>
      </form>

      {/* 削除ボタン（クリック可能＆機能付き） */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 z-20 relative"
        >
          この施術履歴を削除
        </button>
      </div>
    </div>
  );
}
