// src/pages/RecordNew.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecordNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patientNameKanji: "",
    patientNameKana: "",
    date: "",
    startTime: "",
    age: "",
    birth: "",
    job: "",
    phone: "",
    email: "",
    address: "",
    medicalHistory: "",
    allergy: "",
    freeNote: "",
    emergencyContact: "",
    visitPurpose: "",
    note: "",
  });

  const [selectedParts, setSelectedParts] = useState([]);

  const togglePart = (part) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part],
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.patientNameKanji,
          kana: form.patientNameKana,
          phone: form.phone,
          email: form.email,
          memo: form.freeNote,
          birthday: form.birth || null,
          job: form.job || null,
          address: form.address || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "顧客の登録に失敗しました");
      }

      console.log("新規顧客登録成功:", data);

      alert("新規顧客を登録しました！");
      navigate("/customers");
    } catch (err) {
      console.error("顧客登録エラー:", err);
      alert("顧客の登録に失敗しました");
    }
  };

  return (
    <div className="p-8 bg-[#f9f5ee] min-h-screen font-sans text-[#1f3b33]">
      {/* =========================
          戻るボタン + ページタイトル
      ========================= */}
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[#2a2a2a] hover:text-[#1f3b33] font-medium mr-4"
        >
          ← 戻る
        </button>

        <h1 className="text-2xl font-bold tracking-wide">新規カルテ作成</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        {/* =========================
            顧客情報
        ========================= */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">顧客情報</h2>

          <label className="block font-semibold mb-1">顧客名（漢字）</label>

          <input
            type="text"
            name="patientNameKanji"
            placeholder="例：山田 太郎"
            value={form.patientNameKanji}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-gray-400 bg-white"
          />

          <label className="block font-semibold mb-1 mt-4">
            顧客名（カナ）
          </label>

          <input
            type="text"
            name="patientNameKana"
            placeholder="例：ヤマダ タロウ"
            value={form.patientNameKana}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-gray-400 bg-white"
          />

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div>
              <label className="block font-semibold mb-1">年齢</label>

              <input
                type="text"
                name="age"
                placeholder="例：35"
                value={form.age}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-400 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">生年月日</label>

              <input
                type="text"
                name="birth"
                placeholder="例：1991-05-12"
                value={form.birth}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-400 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">職業</label>

              <input
                type="text"
                name="job"
                placeholder="例：会社員"
                value={form.job}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-400 bg-white"
              />
            </div>
          </div>

          <label className="block font-semibold mb-1 mt-6">電話番号</label>

          <input
            type="text"
            name="phone"
            placeholder="例：090-1234-5678"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-gray-400 bg-white"
          />

          <label className="block font-semibold mb-1 mt-4">
            メールアドレス
          </label>

          <input
            type="text"
            name="email"
            placeholder="例：sample@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-gray-400 bg-white"
          />

          <label className="block font-semibold mb-1 mt-4">住所</label>

          <input
            type="text"
            name="address"
            placeholder="例：東京都渋谷区…"
            value={form.address}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-gray-400 bg-white"
          />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block font-semibold mb-1">既往症</label>

              <input
                type="text"
                name="medicalHistory"
                placeholder="例：腰痛"
                value={form.medicalHistory}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-400 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">アレルギー</label>

              <input
                type="text"
                name="allergy"
                placeholder="例：花粉"
                value={form.allergy}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-400 bg-white"
              />
            </div>
          </div>

          <label className="block font-semibold mb-1 mt-6">自由記載</label>

          <textarea
            name="freeNote"
            placeholder="メモや補足を入力"
            value={form.freeNote}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 rounded-md border border-gray-400 bg-white"
          ></textarea>
        </div>

        {/* =========================
            その他情報
        ========================= */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">その他情報</h2>

          <label className="block font-semibold mb-1">緊急連絡先</label>

          <input
            type="text"
            name="emergencyContact"
            placeholder="例：090-0000-0000"
            value={form.emergencyContact}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-gray-400 bg-white mb-4"
          />

          <label className="block font-semibold mb-1">来店目的</label>

          <input
            type="text"
            name="visitPurpose"
            placeholder="例：肩こり改善 / リラックス"
            value={form.visitPurpose}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-gray-400 bg-white mb-4"
          />

          <label className="block font-semibold mb-1">備考</label>

          <textarea
            name="note"
            placeholder="その他の情報を入力"
            value={form.note}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 rounded-md border border-gray-400 bg-white"
          ></textarea>
        </div>

        {/* =========================
            保存・キャンセル
        ========================= */}
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="bg-[#1f3b33] text-white px-6 py-3 rounded-lg hover:bg-[#2a4a3f]"
          >
            顧客を登録
          </button>

          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="bg-white border border-gray-400 text-[#1f3b33] px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
