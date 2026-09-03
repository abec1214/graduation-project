// src/components/RecordDetail.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

export default function RecordDetail({ record, isCreating, onSave }) {
  // 新規作成フォーム用の state
  const [form, setForm] = useState({
    patientName: "",
    therapist: "",
    date: "",
    type: "",
    duration: "",
    pressure: "中",
    allergy: "",
    memo: "",
    parts: [],
  });

  // 既存カルテ表示用
  const [selectedParts, setSelectedParts] = useState(record?.parts || []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleFormPart = (part) => {
    setForm((prev) => ({
      ...prev,
      parts: prev.parts.includes(part)
        ? prev.parts.filter((p) => p !== part)
        : [...prev.parts, part],
    }));
  };

  const toggleRecordPart = (part) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part],
    );
  };

  // 保存処理
  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecord = {
      id: Date.now(),
      name: form.patientName,
      type: `${form.type}・${form.duration}分`,
      pressure: form.pressure,
      date: form.date,
      allergy: form.allergy || "特になし",
      memo: form.memo,
      parts: form.parts,
    };

    onSave(newRecord);
  };

  // 新規作成モード
  if (isCreating) {
    return (
      <div className="space-y-8 p-6 bg-[#f9f5ee] rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">新規予約作成</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 顧客名 */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              顧客名
            </label>
            <input
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm placeholder-gray-400"
            />
          </div>

          {/* 施術日・施術時間 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                施術日
              </label>
              <input
                type="text"
                name="date"
                placeholder="例：2026-08-04"
                value={form.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                施術時間（分）
              </label>
              <input
                type="text"
                name="duration"
                placeholder="例：60"
                value={form.duration}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm placeholder-gray-400"
              />
            </div>
          </div>

          {/* 施術タイプ・圧 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                施術タイプ
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm"
              >
                <option value="">選択してください</option>
                <option value="スウェーデンマッサージ">
                  スウェーデンマッサージ
                </option>
                <option value="アロマトリートメント">
                  アロマトリートメント
                </option>
                <option value="整体">整体</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                圧の強度
              </label>
              <select
                name="pressure"
                value={form.pressure}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm"
              >
                <option value="弱">弱</option>
                <option value="中">中</option>
                <option value="強">強</option>
              </select>
            </div>
          </div>

          {/* アレルギー */}
          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              アレルギー
            </label>
            <input
              type="text"
              name="allergy"
              placeholder="例：ラベンダーオイル / 特になし"
              value={form.allergy || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm placeholder-gray-400"
            />
          </div>

          {/* メモ */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              施術メモ・所見
            </label>
            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white shadow-sm placeholder-gray-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-[#1f3b33] text-white px-5 py-2 rounded-lg hover:bg-[#2a4a40] transition"
          >
            保存する
          </button>
        </form>
      </div>
    );
  }

  // 既存カルテ表示モード
  if (!record) {
    return (
      <div className="text-center text-gray-700 mt-20">
        <p>左のリストから記録を選択</p>
        <p className="text-sm mt-2">または「新規作成」で記録を追加</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{record.type}</h2>
        <p className="text-gray-700">
          {record.date}　{record.therapist}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col bg-[#f9f5ee] rounded-md p-4">
          <span className="text-sm font-semibold text-gray-700">施術時間</span>
          <span className="text-lg font-bold text-gray-900">
            {record.duration || "60分"}
          </span>
        </div>

        <div className="flex flex-col bg-[#f9f5ee] rounded-md p-4">
          <span className="text-sm font-semibold text-gray-700">圧の強度</span>
          <span className="text-lg font-bold text-gray-900">
            {record.pressure}
          </span>
        </div>
      </div>

      <div className="p-4 bg-[#f9f5ee] rounded-md">
        <p className="text-sm font-semibold text-gray-700 mb-2">施術部位</p>
        <div className="flex flex-wrap gap-2">
          {selectedParts.map((p, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-[#e8e3d9] rounded-full text-sm text-gray-900 font-medium shadow-sm"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#f9f5ee] rounded-md">
        <p className="text-sm font-semibold text-gray-700 mb-2">アレルギー</p>
        <p className="text-gray-700 leading-relaxed">
          {record.allergy || "特になし"}
        </p>
      </div>

      <div className="p-4 bg-[#f9f5ee] rounded-md">
        <p className="text-sm text-gray-500 mb-2">施術メモ・所見</p>
        <p className="text-gray-700 leading-relaxed">{record.memo}</p>
      </div>

      <div className="flex space-x-4 pt-4">
        <Link
          to={`/customers/${record.customerId}/records/${record.id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          編集
        </Link>

        <button
          onClick={() => {
            if (!confirm("本当にこのカルテを削除しますか？")) return;
            alert("カルテを削除しました（仮）");
            window.location.href = "/records";
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          削除
        </button>
      </div>
    </div>
  );
}
